import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import {
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import { aggTranslations, joinTranslations } from '@lib/i18n/aggregation';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';
import {
	SurveyChapterConfigurationForm,
	SurveyChapterLeafPresetsForm,
	SurveyChapterPresentationForm,
} from './client';

const getEditorLabelingSurveyChapter = cache(
	async function getEditorLabelingSurvey(chapterId: string) {
		const { user } = await authorize();
		const agg = await joinTranslations(
			db
				.select({
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
			.limit(1);
		return agg[0] ?? null;
	},
	['editor-survey-chapter-id'],
	{
		tags: [CACHE_TAGS.EDITOR_SURVEY_CHAPTER_PRESENTATION, CACHE_TAGS.EDITOR_SURVEY_CHAPTER_CONFIG],
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
			<SurveyChapterLeafPresetsForm />
		</>
	);
}
