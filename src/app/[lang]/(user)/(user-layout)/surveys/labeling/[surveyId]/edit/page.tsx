import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import {
	imagesPools,
	imagesPoolsTranslations,
	labelingSurveys,
	labelingSurveysTranslations,
	labels,
	labelsTranslations,
} from '@lib/database/schema/public';
import { aggTranslations, joinTranslations } from '@lib/i18n/aggregation';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { languageTag } from '@translations/runtime';
import { and, asc, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { SurveyConfigurationForm, SurveyLabelsForm, SurveyPresentationForm } from './client';

const getEditorLabelingSurvey = cache(
	async function getEditorLabelingSurvey(surveyId: string) {
		const { user } = await authorize();
		const [found] = await joinTranslations(
			db
				.select({
					...getColumns(labelingSurveys),
					translations: aggTranslations(getColumns(labelingSurveysTranslations)),
				})
				.from(labelingSurveys)
				.$dynamic(),
			labelingSurveysTranslations,
			eq(labelingSurveys.id, labelingSurveysTranslations.id)
		)
			.groupBy(labelingSurveys.id)
			.where(and(eq(labelingSurveys.id, surveyId), canEditLabelingSurvey({ userId: user.id })))
			.limit(1);
		return found ?? null;
	},
	['editor-survey-id'],
	{ tags: [CACHE_TAGS.EDITOR_SURVEY_PRESENTATION, CACHE_TAGS.EDITOR_SURVEY_CONFIG], revalidate: 10 }
);

export type EditorLabelingSurvey = NonNullable<Awaited<ReturnType<typeof getEditorLabelingSurvey>>>;

const getEditorLabelingSurveyLabels = cache(
	async function (surveyId: string) {
		const { user } = await authorize();
		return await joinTranslations(
			db
				.select({
					...getColumns(labels),
					translations: aggTranslations(getColumns(labelsTranslations)).as('labels_t_agg'),
				})
				.from(labels)
				.$dynamic(),
			labelsTranslations,
			eq(labels.id, labelsTranslations.id)
		)
			.groupBy(labels.id)
			.where(
				and(eq(labels.surveyId, surveyId), canEditLabelingSurvey({ userId: user.id, surveyId }))
			)
			.orderBy(asc(labels.createdAt));
	},
	['editor-survey-id'],
	{ tags: [CACHE_TAGS.EDITOR_SURVEY_LABELS], revalidate: 10 }
);

export type EditorLabelingSurveyLabels = Awaited<ReturnType<typeof getEditorLabelingSurveyLabels>>;

async function getSelectableImagesPools() {
	const lang = languageTag();
	const { id } = getColumns(imagesPools);
	const { title, description } = getColumns(imagesPoolsTranslations);
	return await db
		.select({ id, title, description })
		.from(imagesPools)
		.leftJoin(
			imagesPoolsTranslations,
			and(eq(imagesPools.id, imagesPoolsTranslations.id), eq(imagesPoolsTranslations.lang, lang))
		);
}

export type SelectableImagesPools = Awaited<ReturnType<typeof getSelectableImagesPools>>;

export default async function Page(props: { params: { surveyId: string } }) {
	const survey = await getEditorLabelingSurvey(props.params.surveyId);
	const labels = await getEditorLabelingSurveyLabels(props.params.surveyId);
	const pools = await getSelectableImagesPools();
	if (!survey) {
		notFound();
	}
	return (
		<>
			<SurveyPresentationForm {...survey} />
			<SurveyConfigurationForm {...survey} selectableImagesPools={pools} />
			<SurveyLabelsForm {...survey} labels={labels} />
		</>
	);
}
