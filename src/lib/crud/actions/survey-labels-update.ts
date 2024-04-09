'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labelsTranslations } from '@lib/database/schema/public';
import { labelsWithTranslationsSchema } from '@lib/database/validation';
import { languageTag, setLanguageTag } from '@translations/runtime';
import { toExcluded } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { validateFormData } from '../validation';

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
	console.log(JSON.stringify(parsed.data, null, 2));
	await db
		.insert(labelsTranslations)
		.values(parsed.data.labels.flatMap((label) => Object.values(label.translations)))
		.onConflictDoUpdate({
			target: [labelsTranslations.id, labelsTranslations.lang],
			set: toExcluded({
				text: labelsTranslations.text,
				description: labelsTranslations.description,
			}),
		});
	revalidateTag(CACHE_TAGS.SURVEY_LABELS);
}
