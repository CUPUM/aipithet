import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import { canParticipateLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

async function getChapter(chapterId: string) {
	const { user } = await authorize();
	const { title, description } = getColumns(labelingSurveysChaptersTranslations);
	return (
		(
			await db
				.select({
					...getColumns(labelingSurveysChapters),
					title,
					description,
				})
				.from(labelingSurveysChapters)
				.where(
					and(
						eq(labelingSurveysChapters.id, chapterId),
						canParticipateLabelingSurvey({
							userId: user.id,
							surveyId: labelingSurveysChapters.surveyId,
						})
					)
				)
				.leftJoin(
					labelingSurveysChaptersTranslations,
					and(
						eq(labelingSurveysChaptersTranslations.id, labelingSurveysChapters.id),
						eq(labelingSurveysChaptersTranslations.lang, languageTag())
					)
				)
				.limit(1)
		)[0] ?? null
	);
}

export default async function Page(props: { params: { surveyId: string; chapterId: string } }) {
	const chapter = await getChapter(props.params.chapterId);
	if (!chapter) {
		notFound();
	}
	return (
		<article>
			<header>
				<hgroup>
					<span>{m.survey_chapter()}</span>
					<h1>
						{chapter.title || <span className="italic text-muted-foreground">{m.untitled()}</span>}
					</h1>
				</hgroup>
			</header>
			<section>
				{chapter.description ? (
					<Markdown>{chapter.description}</Markdown>
				) : (
					<p>{m.description_none()}</p>
				)}
			</section>
		</article>
	);
}