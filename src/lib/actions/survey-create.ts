'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveys } from '@lib/database/schema/public';
import { redirect } from '@lib/i18n/utilities-server';

export async function surveyCreate() {
	const { user } = await authorize('surveys.create');
	const [inserted] = await db
		.insert(labelingSurveys)
		.values({ createdById: user.id })
		.returning({ id: labelingSurveys.id });
	if (!inserted) {
		throw new Error('Error when creating survey.');
	}
	redirect(`/surveys/labeling/${inserted.id}/edit`);
}
