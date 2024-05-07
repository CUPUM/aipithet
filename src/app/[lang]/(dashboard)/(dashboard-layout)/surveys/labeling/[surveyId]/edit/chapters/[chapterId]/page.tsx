import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import {
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import { aggTranslations, joinTranslations } from '@lib/i18n/aggregation';
import { canEditLabelingSurvey, isActiveChapter } from '@lib/queries/queries';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';
import {
	ImagePairsUploadForm,
	SurveyChapterConfigurationForm,
	SurveyChapterPresentationForm,
} from './client';

const getEditorLabelingSurveyChapter = cache(
	async function getEditorLabelingSurvey(chapterId: string) {
		const { user } = await authorize();
		const agg = await joinTranslations(
			db
				.select({
					isActive: isActiveChapter(),
					...getColumns(labelingSurveysChapters),
					translations: aggTranslations(getColumns(labelingSurveysChaptersTranslations)),
				})
				.from(labelingSurveysChapters)
				.$dynamic(),
			labelingSurveysChaptersTranslations,
			eq(labelingSurveysChapters.id, labelingSurveysChaptersTranslations.id)
		)
			.where(
				and(
					eq(labelingSurveysChapters.id, chapterId),
					canEditLabelingSurvey({ userId: user.id, surveyId: labelingSurveysChapters.surveyId })
				)
			)
			.groupBy(labelingSurveysChapters.id)
			.limit(1);
		return agg[0] ?? null;
	},
	['editor-survey-chapter-id'],
	{
		tags: [CACHE_TAGS.SURVEY_CHAPTER_PRESENTATION, CACHE_TAGS.SURVEY_CHAPTER_CONFIG],
		revalidate: 10,
	}
);

export type EditorLabelingSurveyChapter = NonNullable<
	Awaited<ReturnType<typeof getEditorLabelingSurveyChapter>>
>;

export default async function Page(props: { params: { surveyId: string; chapterId: string } }) {
	const chapter = await getEditorLabelingSurveyChapter(props.params.chapterId);
	if (!chapter) {
		notFound();
	}
	return (
		<>
			<SurveyChapterPresentationForm {...chapter} />
			<SurveyChapterConfigurationForm {...chapter} />
			<section className="border-boder flex animate-fly-up flex-col gap-6 rounded-lg border bg-background p-6 delay-200 fill-mode-both">
				<h2 className="text-xl font-semibold">Upload fixed pairs</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					To add fixed pairs to this chapter follow these steps:
				</p>
				<section className="flex flex-col gap-4 md:flex-row md:gap-8">
					<ol className="flex flex-1 list-decimal flex-col gap-4 pl-8 text-sm italic text-muted-foreground">
						<li>
							Prepare a <code>json</code> containing the relevant metadata for the pairs, formatted
							as described herein.
						</li>
						<li>Upload the json file below.</li>
					</ol>
					<code className="flex-1 whitespace-pre rounded-sm bg-border/50 p-6 font-mono text-sm leading-relaxed tracking-wide">
						{JSON.stringify(
							{
								pairs: [
									{
										image1: 'string',
										image2: 'string',
										criteria1: 'string',
										criteria2: 'string',
										criteria3: 'string',
										numAnnotators: 'number',
									},
								],
							},
							null,
							2
						).replaceAll('?"', '"?')}
					</code>
				</section>
				<ImagePairsUploadForm chapterId={props.params.chapterId} surveyId={props.params.surveyId} />
			</section>
		</>
	);
}
