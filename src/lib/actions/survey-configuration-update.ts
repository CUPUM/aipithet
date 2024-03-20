'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labelingSurveys } from '@lib/database/schema/public';
import { labelingSurveysSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { getColumns } from 'drizzle-orm-helpers';
import { excluded, now } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';
import { validateFormData } from './validation';

export default async function surveyConfigurationUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysSchema.pick({ id: true, likertStepCount: true }).strict()
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	await db
		.insert(labelingSurveys)
		.values({
			...parsed.data,
			updatedAt: now(),
			updatedById: user.id,
		})
		.onConflictDoUpdate({
			target: [labelingSurveys.id],
			set: excluded(getColumns(labelingSurveys)),
		});
	revalidateTag(CACHE_TAGS.EDITOR_SURVEY_CONFIG);
	return parsed.succeed;
}
