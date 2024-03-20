import { LANG_COLUMN_SCHEMA, withTranslationsSchema } from '@lib/i18n/validation';
import * as m from '@translations/messages';
import { createInsertSchema } from 'drizzle-zod';
import {
	IMAGE_POOL_DESCRIPTION_MAX,
	IMAGE_POOL_TITLE_MAX,
	LABELING_SURVEY_DESCRIPTION_MAX,
	LABELING_SURVEY_LIKERT_STEP_COUNT_MAX,
	LABELING_SURVEY_SUMMARY_MAX,
	LABELING_SURVEY_TITLE_MAX,
} from './constants';
import {
	imagesPools,
	imagesPoolsTranslations,
	labelingSurveys,
	labelingSurveysInvitations,
	labelingSurveysTranslations,
} from './schema/public';

export const labelingSurveysSchema = createInsertSchema(labelingSurveys, {
	likertStepCount: (s) =>
		s.likertStepCount
			.max(
				LABELING_SURVEY_LIKERT_STEP_COUNT_MAX,
				m.survey_likert_step_count_max_error({ n: LABELING_SURVEY_LIKERT_STEP_COUNT_MAX })
			)
			.default(0),
});
export const labelingSurveysTranslationsSchema = createInsertSchema(labelingSurveysTranslations, {
	...LANG_COLUMN_SCHEMA,
	title: (s) => s.title.trim().max(LABELING_SURVEY_TITLE_MAX),
	summary: (s) => s.summary.trim().max(LABELING_SURVEY_SUMMARY_MAX),
	description: (s) => s.description.trim().max(LABELING_SURVEY_DESCRIPTION_MAX),
});
export const labelingSurveysWithTranslationsSchema = withTranslationsSchema(
	labelingSurveysSchema,
	labelingSurveysTranslationsSchema
);

export const labelingSurveysInvitationsSchema = createInsertSchema(labelingSurveysInvitations);

export const imagePoolsSchema = createInsertSchema(imagesPools);
export const imagePoolsTranslationsSchema = createInsertSchema(imagesPoolsTranslations, {
	...LANG_COLUMN_SCHEMA,
	title: (s) => s.title.trim().max(IMAGE_POOL_TITLE_MAX),
	description: (s) => s.description.trim().max(IMAGE_POOL_DESCRIPTION_MAX),
});
export const imagePoolsWithTranslationsSchema = withTranslationsSchema(
	imagePoolsSchema,
	imagePoolsTranslationsSchema.omit({ id: true })
);
