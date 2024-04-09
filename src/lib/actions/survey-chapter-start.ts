'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labelingSurveysChapters } from '@lib/database/schema/public';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { and, eq } from 'drizzle-orm';
import { coalesce, least } from 'drizzle-orm-helpers';
import { now } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';

export default async function surveyChapterStart(chapterId: string) {
	const { user } = await authorize('surveys.chapters.update');
	await db
		.update(labelingSurveysChapters)
		.set({ start: least(new Date(), coalesce(labelingSurveysChapters.start, now())), end: null })
		.where(
			and(
				eq(labelingSurveysChapters.id, chapterId),
				canEditLabelingSurvey({ userId: user.id, surveyId: labelingSurveysChapters.surveyId })
			)
		);
	revalidateTag(CACHE_TAGS.SURVEY_CHAPTER_CONFIG);
}
