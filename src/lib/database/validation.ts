import type { LangSchema } from '@lib/i18n/validation';
import type { AvailableLanguageTag } from '@translations/runtime';
import { availableLanguageTags } from '@translations/runtime';
import { createInsertSchema } from 'drizzle-zod';
import type { ZodObject, ZodSchema, ZodTypeAny } from 'zod';
import { z } from 'zod';
import type { LangColumnName } from './constants';
import { LANG_COLUMN_NAME } from './constants';
import { labelingSurveys, labelingSurveysT } from './schema/public';

/**
 * Extend the insert schema of a given ressource table with its corresponding translations. The
 * resulting schema should be isomorphic with {@link withTranslations}.
 */
export function withTranslationsSchema<
	T extends Record<string, ZodTypeAny>,
	TT extends Record<string, ZodTypeAny> & { [K in LangColumnName]: LangSchema },
>(schema: ZodObject<T>, translationSchema: ZodObject<TT>) {
	return schema.extend({
		translations: z.object(
			availableLanguageTags.reduce(
				(agg, k) => ({
					...agg,
					[k]: translationSchema
						.omit({ [LANG_COLUMN_NAME]: true })
						.extend({ [LANG_COLUMN_NAME]: translationSchema.shape[LANG_COLUMN_NAME].default(k) }),
				}),
				{} as Record<AvailableLanguageTag, ZodSchema<TT>>
			)
		),
	});
}

export const labelingSurveysSchema = createInsertSchema(labelingSurveys);
export const labelingSurveysTranslationsSchema = createInsertSchema(labelingSurveysT);
export const labelingSurveysWithTranslationsSchema = withTranslationsSchema(
	labelingSurveysSchema,
	labelingSurveysTranslationsSchema
);
