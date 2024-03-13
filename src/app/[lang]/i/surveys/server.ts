'use server';

import { authorize } from '@lib/auth/authorization';
import { db } from '@lib/database/db';
import { labelingSurveys } from '@lib/database/schema/public';
import { redirect } from '@lib/i18n/utilities';

export async function joinSurveyWithInvite() {}

export async function createSurvey() {
	const { user } = await authorize('surveys.create');
	const [inserted] = await db
		.insert(labelingSurveys)
		.values({ createdById: user.id })
		.returning({ id: labelingSurveys.id });
	if (!inserted) {
		throw new Error('Error when creating survey.');
	}
	redirect(`/edit/surveys/labeling/${inserted.id}`);
}
