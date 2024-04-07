import { LANG_COLUMN_SCHEMA, withTranslationsSchema } from '@lib/i18n/validation';
import * as m from '@translations/messages';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
	IMAGE_POOL_DESCRIPTION_MAX,
	IMAGE_POOL_TITLE_MAX,
	LABELING_SURVEY_DESCRIPTION_MAX,
	LABELING_SURVEY_SLIDER_STEP_COUNT_MAX,
	LABELING_SURVEY_SUMMARY_MAX,
	LABELING_SURVEY_TITLE_MAX,
} from './constants';
import {
	images,
	imagesPools,
	imagesPoolsInvitations,
	imagesPoolsTranslations,
	imagesPrompts,
	labelingSurveys,
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
	labelingSurveysInvitations,
	labelingSurveysTranslations,
	labels,
	labelsTranslations,
} from './schema/public';

export const imagesPoolsSchema = createInsertSchema(imagesPools);
export const imagesPoolsTranslationsSchema = createInsertSchema(imagesPoolsTranslations, {
	...LANG_COLUMN_SCHEMA,
	title: (s) => s.title.trim().max(IMAGE_POOL_TITLE_MAX),
	description: (s) => s.description.trim().max(IMAGE_POOL_DESCRIPTION_MAX),
});
export const imagesPoolsWithTranslationsSchema = withTranslationsSchema(
	imagesPoolsSchema,
	imagesPoolsTranslationsSchema
);

export const imagesPoolsInvitationsSchema = createInsertSchema(imagesPoolsInvitations);

export const imagesPromptsSchema = createInsertSchema(imagesPrompts);

export const imagesSchema = createInsertSchema(images);

export const labelsSchema = createInsertSchema(labels);
export const labelsTranslationsSchema = createInsertSchema(labelsTranslations, {
	...LANG_COLUMN_SCHEMA,
});
export const labelsWithTranslationsSchema = withTranslationsSchema(
	labelsSchema,
	labelsTranslationsSchema
);

export const labelingSurveysSchema = createInsertSchema(labelingSurveys, {
	sliderStepCount: (s) =>
		s.sliderStepCount
			.max(
				LABELING_SURVEY_SLIDER_STEP_COUNT_MAX,
				m.survey_slider_step_count_max_error({ n: LABELING_SURVEY_SLIDER_STEP_COUNT_MAX })
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

export const labelingSurveysChaptersSchema = createInsertSchema(labelingSurveysChapters, {
	start: z.string().pipe(z.coerce.date()),
	end: z.string().pipe(z.coerce.date()),
});
export const labelingSurveysChaptersTranslationsSchema = createInsertSchema(
	labelingSurveysChaptersTranslations,
	{
		...LANG_COLUMN_SCHEMA,
		title: (s) => s.title.trim().max(LABELING_SURVEY_TITLE_MAX),
		summary: (s) => s.summary.trim().max(LABELING_SURVEY_SUMMARY_MAX),
		description: (s) => s.description.trim().max(LABELING_SURVEY_DESCRIPTION_MAX),
	}
);
export const labelingSurveysChaptersWithTranslationsSchema = withTranslationsSchema(
	labelingSurveysChaptersSchema,
	labelingSurveysChaptersTranslationsSchema
);
