import { db } from '@lib/database/db';
import {
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, asc, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { SurveyChapterCreateForm } from './client';

export default async function Page(props: { params: { surveyId: string } }) {
	const lang = languageTag();
	const { id, createdAt } = getColumns(labelingSurveysChapters);
	const { title, summary } = getColumns(labelingSurveysChaptersTranslations);
	const chapters = await db
		.select({
			id,
			createdAt,
			title,
			summary,
		})
		.from(labelingSurveysChapters)
		.leftJoin(
			labelingSurveysChaptersTranslations,
			and(
				eq(labelingSurveysChapters.id, labelingSurveysChaptersTranslations.id),
				eq(labelingSurveysChaptersTranslations.lang, lang)
			)
		)
		.where(eq(labelingSurveysChapters.surveyId, props.params.surveyId))
		.orderBy(asc(createdAt));

	return (
		<>
			<ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{chapters.map((chapter, i) => (
					<li key={chapter.id}>
						<Link
							href={`/surveys/labeling/${props.params.surveyId}/edit/chapters/${chapter.id}`}
							className="group/link flex aspect-[5/3] animate-fly-up flex-col items-start gap-4 rounded-lg border border-border bg-background px-7 py-6 transition-all duration-75 fill-mode-both after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] hover:border-primary hover:after:bg-primary/20"
							style={{ animationDelay: `${i * 50}ms`, animationDuration: '400ms' }}
						>
							<div className="text-xl font-semibold">
								{chapter.title || (
									<span className="italic text-muted-foreground">{m.untitled()}</span>
								)}
							</div>
							<div className="text-md flex-1 text-muted-foreground">{chapter.summary}</div>
							<span className="text-sm font-light text-muted-foreground">
								{m.created_at({
									date: chapter.createdAt.toLocaleDateString(lang),
									time: chapter.createdAt.toLocaleTimeString(lang),
								})}
							</span>
						</Link>
					</li>
				))}
				<SurveyChapterCreateForm surveyId={props.params.surveyId} />
			</ul>
		</>
	);
}
