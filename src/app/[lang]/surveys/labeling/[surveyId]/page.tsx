import { authorize } from '@lib/auth/auth';
import { Button } from '@lib/components/primitives/button';
import { db } from '@lib/database/db';
import {
	labelingSurveys,
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
	labelingSurveysTranslations,
} from '@lib/database/schema/public';
import Link from '@lib/i18n/Link';
import { canParticipateLabelingSurvey, isActiveChapter } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Markdown from 'react-markdown';

async function getSurvey(surveyId: string) {
	const { user } = await authorize();
	const { id } = getColumns(labelingSurveys);
	const { title, description } = getColumns(labelingSurveysTranslations);
	return (
		(
			await db
				.select({
					id,
					title,
					description,
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
		)[0] ?? null
	);
}

async function Chapters(props: { surveyId: string }) {
	const { title, summary } = getColumns(labelingSurveysChaptersTranslations);
	const chapters = await db
		.select({
			isActive: isActiveChapter(),
			...getColumns(labelingSurveysChapters),
			title,
			summary,
		})
		.from(labelingSurveysChapters)
		.where(eq(labelingSurveysChapters.surveyId, props.surveyId))
		.leftJoin(
			labelingSurveysChaptersTranslations,
			and(
				eq(labelingSurveysChaptersTranslations.id, labelingSurveysChapters.id),
				eq(labelingSurveysChaptersTranslations.lang, languageTag())
			)
		);
	return chapters.map((chapter) => (
		<Link
			aria-disabled={!chapter.isActive || undefined}
			href={`/surveys/labeling/${props.surveyId}/${chapter.id}`}
			className="flex aspect-[5/3] w-full max-w-screen-sm flex-col gap-6 rounded-md border border-transparent bg-background p-12 transition-all hover:border-primary aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:bg-border/50"
		>
			<span className="relative flex flex-row items-center self-start rounded-full bg-input p-2 text-sm">
				<div
					data-active={chapter.isActive}
					className="aspect-square w-3 rounded-full bg-input data-[active]:animate-pulse data-[active]:bg-green-500"
				/>
				<span className="pl-3 pr-2 font-medium opacity-50">
					{chapter.isActive ? m.active() : m.inactive()}
				</span>
			</span>
			<span className="text-4xl font-medium">
				{chapter.title || <span className="italic text-muted-foreground">{m.untitled()}</span>}
			</span>
			<section>
				{chapter.summary ? (
					<Markdown></Markdown>
				) : (
					<p className="italic text-muted-foreground">{m.description_none()}</p>
				)}
			</section>
		</Link>
	));
}

async function RecentAnswers(props: { surveyId: string }) {
	return <li className="">To do</li>;
}

export default async function Page(props: { params: { surveyId: string } }) {
	const survey = await getSurvey(props.params.surveyId);
	if (!survey) {
		notFound();
	}
	return (
		<article className="flex w-full flex-col gap-10 px-2 pb-20 md:px-6">
			<section className="w-full max-w-screen-lg self-center">
				<header className="mb-12 flex min-h-[calc(100vh-4rem)] flex-col justify-center border-b border-dashed border-border p-6 pb-40">
					<h1 className="animate-fly-up text-6xl font-semibold leading-tight">{survey.title}</h1>
				</header>
				{survey.description ? (
					<Markdown>{survey.description}</Markdown>
				) : (
					<p className="italic text-muted-foreground">{m.description_none()}</p>
				)}
				<menu className="sticky bottom-10 flex w-full flex-row justify-center gap-2 p-2">
					<Button disabled>Pick up where I left</Button>
				</menu>
			</section>
			<section className="flex w-full max-w-screen-lg flex-col self-center rounded-lg border border-border">
				<h2 className="text-md p-8 pb-0 font-semibold">{m.survey_chapters()}</h2>
				<nav className="flex flex-row overflow-x-scroll p-8">
					<Suspense>
						<Chapters surveyId={props.params.surveyId} />
					</Suspense>
				</nav>
			</section>
			<section className="flex w-full max-w-screen-lg flex-col self-center rounded-lg bg-accent/50 dark:bg-border/30">
				<h2 className="text-md p-8 pb-0 font-semibold">{m.answers_history()}</h2>
				<ul className="flex flex-row overflow-x-scroll p-8">
					<Suspense>
						<RecentAnswers surveyId={props.params.surveyId} />
					</Suspense>
				</ul>
			</section>
		</article>
	);
}
