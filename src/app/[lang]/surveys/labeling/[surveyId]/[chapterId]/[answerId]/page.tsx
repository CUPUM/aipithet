import { authorize } from '@lib/auth/auth';
import { Skeleton } from '@lib/components/primitives/skeleton';
import { Spinner } from '@lib/components/primitives/spinner';
import { db } from '@lib/database/db';
import {
	images,
	labelingSurveys,
	labelingSurveysAnswers,
	labelingSurveysChapters,
	labelsTranslations,
} from '@lib/database/schema/public';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { jsonBuildObject } from 'drizzle-orm-helpers/pg';
import { alias } from 'drizzle-orm/pg-core';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import { LabelingForm } from './client';

const getSurveyAnswer = cache(async function (answerId: string) {
	const { user } = await authorize();
	const image1 = alias(images, 'image1');
	const image2 = alias(images, 'image2');
	const { sliderStepCount } = getColumns(labelingSurveys);
	return (
		(
			await db
				.select({
					...getColumns(labelingSurveysAnswers),
					label: getColumns(labelsTranslations),
					images: jsonBuildObject({ 1: image1, 2: image2 }),
					sliderStepCount,
				})
				.from(labelingSurveysAnswers)
				.where(
					and(eq(labelingSurveysAnswers.id, answerId), eq(labelingSurveysAnswers.userId, user.id))
				)
				.leftJoin(
					labelsTranslations,
					and(
						eq(labelsTranslations.id, labelingSurveysAnswers.labelId),
						eq(labelsTranslations.lang, languageTag())
					)
				)
				.leftJoin(image1, eq(image1.id, labelingSurveysAnswers.image1Id))
				.leftJoin(image2, eq(image2.id, labelingSurveysAnswers.image2Id))
				.leftJoin(
					labelingSurveysChapters,
					eq(labelingSurveysChapters.id, labelingSurveysAnswers.chapterId)
				)
				.leftJoin(labelingSurveys, eq(labelingSurveys.id, labelingSurveysChapters.surveyId))
				.limit(1)
		)[0] || notFound()
	);
});

export type SurveyAnswer = NonNullable<Awaited<ReturnType<typeof getSurveyAnswer>>>;

const getPreviousSurveyAnswer = cache(async function (answerId: string) {
	const { user } = await authorize();
});

const getNextSurveyAnswer = cache(async function (answerId: string) {
	const { user } = await authorize();
});

async function Label(props: { answerId: string }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	return (
		<hgroup>
			{surveyAnswer.label?.text || (
				<span className="italic text-muted-foreground">{m.label_no_text()}</span>
			)}
		</hgroup>
	);
}

async function AnswerImage(props: { answerId: string; index: 1 | 2 }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	const image = surveyAnswer.images[props.index];
	const src = `https://storage.googleapis.com/${image.bucket}${image.path}`;
	return (
		<>
			{/* <img src={src} /> */}
			<Image
				src={src}
				alt={`Image ${props.index}`}
				width={image.width}
				height={image.height}
				className="flex-1 rounded-sm bg-border/50 p-12 text-center"
			/>
		</>
	);
}

async function LabelingFormServer(props: { answerId: string }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	return <LabelingForm {...surveyAnswer} />;
}

export default async function Page(props: {
	params: { surveyId: string; chapterId: string; answerId: string };
}) {
	return (
		<article className="flex flex-1 flex-col">
			<header>
				<Suspense
					fallback={
						<hgroup>
							<Skeleton>Test</Skeleton>
						</hgroup>
					}
				>
					<Label answerId={props.params.answerId} />
				</Suspense>
			</header>
			<section className="relative flex flex-1 flex-row items-center justify-center gap-6 p-8 xl:gap-12 xl:p-16">
				<Suspense
					fallback={
						<Skeleton className="flex aspect-square flex-1 items-center justify-center rounded-sm bg-border/50">
							<Spinner />
						</Skeleton>
					}
				>
					<AnswerImage index={1} answerId={props.params.answerId} />
				</Suspense>
				<Suspense
					fallback={
						<Skeleton className="flex aspect-square flex-1 items-center justify-center rounded-sm bg-border/50 delay-300 fill-mode-both">
							<Spinner />
						</Skeleton>
					}
				>
					<AnswerImage index={2} answerId={props.params.answerId} />
				</Suspense>
				<Suspense>
					<LabelingFormServer answerId={props.params.answerId} />
				</Suspense>
			</section>
			<footer>Stuff</footer>
		</article>
	);
}
