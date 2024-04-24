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
import { languageTag } from '@translations/runtime';
import { and, count, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { jsonBuildObject } from 'drizzle-orm-helpers/pg';
import { alias } from 'drizzle-orm/pg-core';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import { AnswerImageClient, LabelClient, LabelingFormClient } from './client';

export type ImageIndex = 1 | 2;
export type LabelIndex = 1 | 2 | 3;

const getChapter = cache(async function (chapterId: string) {
	const { user } = await authorize();
	return (
		(
			await db
				.select({
					...getColumns(labelingSurveysChapters),
					progress: count(labelingSurveysAnswers),
				})
				.from(labelingSurveysChapters)
				.where(eq(labelingSurveysChapters.id, chapterId))
				.leftJoin(
					labelingSurveysAnswers,
					and(
						eq(labelingSurveysAnswers.chapterId, labelingSurveysChapters.id),
						eq(labelingSurveysAnswers.userId, user.id)
					)
				)
				.groupBy(labelingSurveysChapters.id)
				.limit(1)
		)[0] || notFound()
	);
});

const getSurveyAnswer = cache(async function (answerId: string) {
	const { user } = await authorize();
	const image1 = alias(images, 'image1');
	const image2 = alias(images, 'image2');
	const label1 = alias(labelsTranslations, 'label1');
	const label2 = alias(labelsTranslations, 'label2');
	const label3 = alias(labelsTranslations, 'label3');
	const { sliderStepCount } = getColumns(labelingSurveys);
	return (
		(
			await db
				.select({
					...getColumns(labelingSurveysAnswers),
					labels: jsonBuildObject({ 1: label1, 2: label2, 3: label3 }),
					images: jsonBuildObject({ 1: image1, 2: image2 }),
					sliderStepCount,
				})
				.from(labelingSurveysAnswers)
				.where(
					and(eq(labelingSurveysAnswers.id, answerId), eq(labelingSurveysAnswers.userId, user.id))
				)
				.leftJoin(
					label1,
					and(
						eq(label1.id, labelingSurveysAnswers.label1Id),
						eq(label1.lang, languageTag())
					)
				)
				.leftJoin(
					label2,
					and(
						eq(label2.id, labelingSurveysAnswers.label2Id),
						eq(label2.lang, languageTag())
					)
				)
				.leftJoin(
					label3,
					and(
						eq(label3.id, labelingSurveysAnswers.label3Id),
						eq(label3.lang, languageTag())
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

async function Label(props: { index: LabelIndex; answerId: string }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	const label = surveyAnswer.labels[props.index];
	return <LabelClient text={label.text} description={label.description} />;
}

async function AnswerImage(props: { answerId: string; index: ImageIndex }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	const image = surveyAnswer.images[props.index];
	const src = `https://storage.googleapis.com/${image.bucket}${image.path}`;
	return (
		<AnswerImageClient
			imageId={image.id}
			index={props.index}
			answerId={props.answerId}
			key={src}
			src={src}
			alt={`Image ${props.index}`}
			// width={image.width}
			// height={image.height}
		/>
	);
}

async function LabelingForm(props: { answerId: string; surveyId: string }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	return <LabelingFormClient {...surveyAnswer} surveyId={props.surveyId} />;
}

async function Progress(props: { chapterId: string }) {
	const chapter = await getChapter(props.chapterId);
	return (
		<progress
			value={chapter.maxAnswersCount ? chapter.progress : undefined}
			max={chapter.maxAnswersCount || undefined}
			className="h-3 w-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
		/>
	);
}

export default async function Page(props: {
	params: { surveyId: string; chapterId: string; answerId: string };
}) {
	return (
		<article className="flex h-[calc(100vh-72px)] w-full flex-col items-stretch">
			<section className="relative grid flex-1 grid-cols-2 grid-rows-1 items-center justify-center gap-6 px-12 py-6">
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
			</section>
			<section>
				<Suspense
					fallback={
						<hgroup>
							<Skeleton className="text-transparent">...</Skeleton>
						</hgroup>
					}
				>
					<Label index={1} answerId={props.params.answerId} />
				</Suspense>
				<Suspense>
					<LabelingForm answerId={props.params.answerId} surveyId={props.params.surveyId} />
				</Suspense>
			</section>
			<footer className="flex flex-none flex-col items-center px-8 py-4">
				<Progress chapterId={props.params.chapterId} />
				<nav className="flex flex-row gap-2">
					{/* <div>Previous</div>
					<div>Next</div> */}
				</nav>
			</footer>
		</article>
	);
}