import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	labelingSurveys,
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
	labelingSurveysTranslations,
} from '@lib/database/schema/public';
import { canEditLabelingSurvey, isActiveChapter } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, asc, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Markdown from 'react-markdown';
import { DownloadButton } from './client';

const getSurvey = async (surveyId: string) => {
	const lang = languageTag();
	const { user } = await authorize();
	const [survey] = await db
		.select({ title: labelingSurveysTranslations.title })
		.from(labelingSurveys)
		.leftJoin(
			labelingSurveysTranslations,
			and(
				eq(labelingSurveys.id, labelingSurveysTranslations.id),
				eq(labelingSurveysTranslations.lang, lang)
			)
		)
		.where(and(eq(labelingSurveys.id, surveyId), canEditLabelingSurvey({ userId: user.id })))
		.limit(1);
	return survey;
};

async function Chapters(props: { surveyId: string }) {
	const { user } = await authorize();
	const { title, summary } = getColumns(labelingSurveysChaptersTranslations);
	// TODO: Merge both queries into one
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
		)
		.orderBy(asc(labelingSurveysChapters.start));

	return chapters.map((chapter, index) => (
		<Link
			href={`/surveys/labeling/${props.surveyId}/view/${chapter.id}`}
			className="group/chapter flex aspect-[5/3] w-full max-w-screen-sm flex-none flex-col gap-6 rounded-md border border-transparent bg-border/50 p-12 transition-all hover:border-primary aria-disabled:pointer-events-none aria-disabled:bg-border/25 aria-disabled:text-foreground/50"
		>
			<span className="text-4xl font-medium">
				{chapter.title || <span className="italic text-muted-foreground">{m.untitled()}</span>}
			</span>
			<section>
				{chapter.summary ? (
					<Markdown>{chapter.summary}</Markdown>
				) : (
					<p className="italic text-muted-foreground">{m.description_none()}</p>
				)}
			</section>
		</Link>
	));
}

export default async function Page(props: { params: { surveyId: string } }) {
	const survey = await getSurvey(props.params.surveyId);

	if (!survey) {
		notFound();
	}

	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-start gap-6 self-center">
			<header className="flex flex-row justify-between gap-6">
				<h1 className="text-5xl font-semibold">
					{survey.title || <span className="italic opacity-50">{m.untitled()}</span>}
				</h1>
				<DownloadButton surveyId={props.params.surveyId} />
			</header>
			<section className="flex w-full max-w-screen-xl flex-col self-center rounded-lg border border-border">
				<h2 className="text-md p-8 px-12 pb-0 font-semibold">{m.survey_chapters()}</h2>
				<nav className="flex flex-row gap-10 overflow-x-scroll p-12">
					<Suspense>
						<Chapters surveyId={props.params.surveyId} />
					</Suspense>
				</nav>
			</section>
		</div>
	);
}
