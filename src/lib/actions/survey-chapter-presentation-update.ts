'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	labelingSurveys,
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import { labelingSurveysChaptersWithTranslationsSchema } from '@lib/database/validation';
import { languageTagServer, revalidatePath } from '@lib/i18n/utilities-server';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { setLanguageTag, sourceLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { now, toExcluded } from 'drizzle-orm-helpers/pg';
import { validateFormData } from './validation';

export default async function surveyChapterPresentationUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('surveys.chapters.update');
	const parsed = validateFormData(
		formData,
		labelingSurveysChaptersWithTranslationsSchema.shape.translations
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const surveyId = await db.transaction(async (tx) => {
		await tx
			.insert(labelingSurveysChaptersTranslations)
			.values(Object.values(parsed.data))
			.onConflictDoUpdate({
				target: [labelingSurveysChaptersTranslations.id, labelingSurveysChaptersTranslations.lang],
				set: toExcluded(getColumns(labelingSurveysChaptersTranslations)),
			});
		const [survey] = await tx
			.select({ id: labelingSurveysChapters.surveyId })
			.from(labelingSurveysChapters)
			.where(
				and(
					eq(labelingSurveysChapters.id, parsed.data[sourceLanguageTag].id),
					canEditLabelingSurvey({ userId: user.id, surveyId: labelingSurveysChapters.surveyId })
				)
			)
			.limit(1);
		if (!survey) {
			throw tx.rollback();
		}
		await tx
			.update(labelingSurveys)
			.set({
				updatedAt: now(),
				updatedById: user.id,
			})
			.where(eq(labelingSurveys.id, survey.id));
		return survey.id;
	});
	revalidatePath(
		`/surveys/labeling/${surveyId}/edit/chapters/${parsed.data[sourceLanguageTag].id}`,
		'layout'
	);
	return parsed.succeed;
}
