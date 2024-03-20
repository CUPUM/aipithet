'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labelingSurveys, labelingSurveysTranslations } from '@lib/database/schema/public';
import { labelingSurveysWithTranslationsSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { getColumns } from 'drizzle-orm-helpers';
import { excluded, now } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';
import { validateFormData } from './validation';

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
				target: [labelingSurveysTranslations.id, labelingSurveysTranslations.lang],
				set: excluded(getColumns(labelingSurveysTranslations)),
			});
		await tx.update(labelingSurveys).set({
			updatedAt: now(),
			updatedById: user.id,
		});
	});
	revalidateTag(CACHE_TAGS.EDITOR_SURVEY_PRESENTATION);
	return parsed.succeed;
}
