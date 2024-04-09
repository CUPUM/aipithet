'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labelingSurveysChapters } from '@lib/database/schema/public';
import { labelingSurveysChaptersSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { validateFormData } from '../validation';

export default async function surveyChapterConfigurationUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysChaptersSchema.omit({ surveyId: true }).required({ id: true })
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const { id, ...data } = parsed.data;
	await db
		.update(labelingSurveysChapters)
		.set(data)
		.where(
			and(
				eq(labelingSurveysChapters.id, id),
				canEditLabelingSurvey({ userId: user.id, surveyId: labelingSurveysChapters.surveyId })
			)
		);
	revalidateTag(CACHE_TAGS.SURVEY_CHAPTER_CONFIG);
	return parsed.succeed;
}
