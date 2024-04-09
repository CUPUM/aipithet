'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labels } from '@lib/database/schema/public';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { revalidateTag } from 'next/cache';

export default async function surveyLabelCreate(surveyId: string) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('labels.create');
	const [inserted] = await db
		.insert(labels)
		.values({ createdById: user.id, surveyId: surveyId })
		.returning({ id: labels.id });
	if (!inserted) {
		throw new Error('Error when creating label.');
	}
	revalidateTag(CACHE_TAGS.SURVEY_LABELS);
}
