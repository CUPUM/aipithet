'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labelingSurveys, labelingSurveysTranslations } from '@lib/database/schema/public';
import { labelingSurveysWithTranslationsSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { setLanguageTag, sourceLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { now, toExcluded } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';
import { validateFormData } from '../validation';

export default async function surveyPresentationUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysWithTranslationsSchema.shape.translations
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	await db.transaction(async (tx) => {
		await tx
			.insert(labelingSurveysTranslations)
			.values(Object.values(parsed.data))
			.onConflictDoUpdate({
				where: canEditLabelingSurvey({
					userId: user.id,
					surveyId: labelingSurveysTranslations.id,
				}),
				target: [labelingSurveysTranslations.id, labelingSurveysTranslations.lang],
				set: toExcluded(getColumns(labelingSurveysTranslations)),
			});
		await tx
			.update(labelingSurveys)
			.set({
				updatedAt: now(),
				updatedById: user.id,
			})
			.where(
				and(
					eq(labelingSurveys.id, parsed.data[sourceLanguageTag].id),
					canEditLabelingSurvey({ userId: user.id })
				)
			);
	});
	revalidateTag(CACHE_TAGS.SURVEY_PRESENTATION);
	return parsed.succeed;
}
