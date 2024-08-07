import { checkIfChapterCompleted } from '@lib/actions/check-if-chapter-completed';
import { checkIfUserBreak } from '@lib/actions/check-if-user-break';
import { authorize } from '@lib/auth/auth';
import { Button } from '@lib/components/primitives/button';
import { db } from '@lib/database/db';
import {
	images,
	labelingSurveys,
	labelingSurveysAnswers,
	labelingSurveysChapters,
	labelingSurveysPairs,
	labelingSurveysTranslations,
	labelsTranslations,
} from '@lib/database/schema/public';
import { canParticipateLabelingSurvey } from '@lib/queries/queries';
import { languageTag } from '@translations/runtime';
import { and, count, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { jsonBuildObject } from 'drizzle-orm-helpers/pg';
import { alias } from 'drizzle-orm/pg-core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import { AnswerImagesClient, HelpClient, LabelingFormClient } from './client';

export type ImageIndex = 1 | 2;
export type LabelIndex = 1 | 2 | 3;

const getSurvey = cache(async function (surveyId: string) {
	const { user } = await authorize();
	const { help } = getColumns(labelingSurveysTranslations);
	return (
		(
			await db
				.select({
					...getColumns(labelingSurveys),
					help,
				})
				.from(labelingSurveys)
				.where(
					and(eq(labelingSurveys.id, surveyId), canParticipateLabelingSurvey({ userId: user.id }))
				)
				.leftJoin(
					labelingSurveysTranslations,
					and(
						eq(labelingSurveysTranslations.id, labelingSurveys.id),
						eq(labelingSurveysTranslations.lang, languageTag())
					)
				)
				.limit(1)
		)[0] || notFound()
	);
});

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
					chapterId: labelingSurveysAnswers.chapterId,
					sliderStepCount,
				})
				.from(labelingSurveysAnswers)
				.where(
					and(eq(labelingSurveysAnswers.id, answerId), eq(labelingSurveysAnswers.userId, user.id))
				)
				.leftJoin(
					labelingSurveysPairs,
					and(eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId))
				)
				.leftJoin(
					label1,
					and(eq(label1.id, labelingSurveysPairs.label1Id), eq(label1.lang, languageTag()))
				)
				.leftJoin(
					label2,
					and(eq(label2.id, labelingSurveysPairs.label2Id), eq(label2.lang, languageTag()))
				)
				.leftJoin(
					label3,
					and(eq(label3.id, labelingSurveysPairs.label3Id), eq(label3.lang, languageTag()))
				)
				.leftJoin(image1, eq(image1.id, labelingSurveysPairs.image1Id))
				.leftJoin(image2, eq(image2.id, labelingSurveysPairs.image2Id))
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

async function AnswerImages(props: { answerId: string }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	return <AnswerImagesClient {...surveyAnswer} />;
}

async function LabelingForm(props: { answerId: string; surveyId: string }) {
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	return <LabelingFormClient {...surveyAnswer} surveyId={props.surveyId} />;
}

async function Progress(props: { answerId: string; chapterId: string }) {
	const chapter = await getChapter(props.chapterId);
	const surveyAnswer = await getSurveyAnswer(props.answerId);
	return (
		<div className="flex w-full flex-1 items-center gap-6">
			{surveyAnswer.prevAnswerId ? (
				<Link
					href={`/surveys/labeling/${surveyAnswer.surveyId}/${props.chapterId}/${surveyAnswer.prevAnswerId}`}
				>
					<Button type="button" size="sm" className="pointer-events-auto">
						Previous
					</Button>
				</Link>
			) : (
				<div></div>
			)}
			<progress
				value={chapter.maxAnswersCount ? chapter.progress : undefined}
				max={chapter.maxAnswersCount || undefined}
				className="h-3 flex-1 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
			/>
			<div>
				{chapter.progress} / {chapter.maxAnswersCount}
			</div>
			{surveyAnswer.nextAnswerId ? (
				<Link
					href={`/surveys/labeling/${surveyAnswer.surveyId}/${props.chapterId}/${surveyAnswer.nextAnswerId}`}
				>
					<Button type="button" size="sm" className="pointer-events-auto">
						Next
					</Button>
				</Link>
			) : (
				<div></div>
			)}
		</div>
	);
}

async function Help(props: { surveyId: string }) {
	const survey = await getSurvey(props.surveyId);

	return <HelpClient help={survey.help} />;
}

export default async function Page(props: {
	params: { surveyId: string; chapterId: string; answerId: string };
}) {
	const { user } = await authorize();
	await checkIfChapterCompleted(props.params.surveyId, props.params.chapterId);
	await checkIfUserBreak(props.params.surveyId, props.params.chapterId);

	return (
		<article className="flex h-[calc(100vh-48px)] w-full flex-col items-stretch">
			<header className="flex justify-end px-8">
				<Suspense>
					<Help surveyId={props.params.surveyId} />
				</Suspense>
			</header>
			<section className="flex flex-1 px-8 pb-4">
				<Suspense>
					<AnswerImages answerId={props.params.answerId} />
				</Suspense>
			</section>
			<section>
				<Suspense>
					<LabelingForm answerId={props.params.answerId} surveyId={props.params.surveyId} />
				</Suspense>
			</section>
			<footer className="flex flex-none flex-col items-center gap-2 px-8 pb-4">
				<Progress chapterId={props.params.chapterId} answerId={props.params.answerId} />
			</footer>
		</article>
	);
}
