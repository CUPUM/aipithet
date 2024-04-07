'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labels } from '@lib/database/schema/public';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export default async function surveyLabelDelete(options: { id: string; surveyId: string }) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('labels.delete');
	await db
		.delete(labels)
		.where(
			and(
				eq(labels.id, options.id),
				eq(labels.surveyId, options.surveyId),
				canEditLabelingSurvey({ userId: user.id, surveyId: options.surveyId })
			)
		);
	revalidateTag(CACHE_TAGS.SURVEY_LABELS);
}
