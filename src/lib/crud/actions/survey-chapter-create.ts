'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveysChapters } from '@lib/database/schema/public';
import { labelingSurveysChaptersSchema } from '@lib/database/validation';
import { languageTagServer, redirect } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { validateFormData } from '../validation';

export default async function surveyChapterCreate(formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('surveys.chapters.create');
	const parsed = validateFormData(
		formData,
		labelingSurveysChaptersSchema.pick({ surveyId: true }).strip()
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const [inserted] = await db
		.insert(labelingSurveysChapters)
		.values({ createdById: user.id, surveyId: parsed.data.surveyId })
		.returning({ id: labelingSurveysChapters.id });
	if (!inserted) {
		throw new Error('Error, could not create survey chapter.');
	}
	redirect(`/surveys/labeling/${parsed.data.surveyId}/edit/chapters/${inserted.id}`);
}
