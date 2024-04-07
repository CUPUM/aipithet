'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelsTranslations } from '@lib/database/schema/public';
import { labelsWithTranslationsSchema } from '@lib/database/validation';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import { languageTag, setLanguageTag } from '@translations/runtime';
import { getColumns } from 'drizzle-orm-helpers';
import { toExcluded } from 'drizzle-orm-helpers/pg';
import { z } from 'zod';
import { validateFormData } from './validation';

export default async function surveyLabelsUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTag);
	const { user } = await authorize('labels.update');
	const parsed = validateFormData(
		formData,
		z.object({ labels: labelsWithTranslationsSchema.pick({ translations: true }).array() })
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	await db
		.insert(labelsTranslations)
		.values(parsed.data.labels.flatMap((label) => Object.values(label.translations)))
		.onConflictDoUpdate({
			where: canEditLabelingSurvey({ userId: user.id, surveyId: labelsTranslations.id }),
			target: [labelsTranslations.id, labelsTranslations.lang],
			set: toExcluded(getColumns(labelsTranslations)),
		});
}
