'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveys } from '@lib/database/schema/public';
import { languageTagServer, redirect } from '@lib/i18n/utilities-server';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';

export default async function surveyDelete(surveyId: string) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('surveys.delete');
	const [deleted] = await db
		.delete(labelingSurveys)
		.where(and(eq(labelingSurveys.id, surveyId), canEditLabelingSurvey({ userId: user.id })))
		.returning({ id: labelingSurveys.id });
	if (!deleted) {
		throw new Error('No survey deleted.');
	}
	redirect(`/surveys`);
}
