'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labelingSurveys } from '@lib/database/schema/public';
import { labelingSurveysSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { validateFormData } from './validation';

export default async function surveyBreakUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysSchema
			.pick({
				id: true,
				allowBreaks: true,
				breakDuration: true,
				breakFrequency: true,
				sessionDuration: true,
				breakMessage: true,
			})
			.strip()
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const { id: surveyId, ...data } = parsed.data;
	if (!surveyId) {
		notFound();
	}
	await db
		.update(labelingSurveys)
		.set({
			...data,
			updatedAt: now(),
			updatedById: user.id,
		})
		.where(and(eq(labelingSurveys.id, surveyId), canEditLabelingSurvey({ userId: user.id })));
	revalidateTag(CACHE_TAGS.SURVEY_CONFIG);
	return parsed.succeed;
}
