'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { labels, labelsTranslations } from '@lib/database/schema/public';
import { labelsWithTranslationsSchema } from '@lib/database/validation';
import { languageTag, setLanguageTag } from '@translations/runtime';
import { eq } from 'drizzle-orm';
import { toExcluded } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { validateFormData } from './validation';

export default async function surveyLabelsUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTag);
	const { user } = await authorize('labels.update');
	const parsed = validateFormData(
		formData,
		z.object({
			labels: labelsWithTranslationsSchema
				.pick({ externalId: true, translations: true, id: true })
				.array(),
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}

	const updatedLabels = await db.transaction(async (tx) => {
		await Promise.all(
			parsed.data.labels.map(async (label) => {
				if (!label.id) {
					throw new Error('Label id is required');
				}

				return tx
					.update(labels)
					.set({
						externalId: label.externalId,
					})
					.where(eq(labels.id, label.id));
			})
		);

		await tx
			.insert(labelsTranslations)
			.values(parsed.data.labels.flatMap((label) => Object.values(label.translations)))
			.onConflictDoUpdate({
				target: [labelsTranslations.id, labelsTranslations.lang],
				set: toExcluded({
					text: labelsTranslations.text,
					description: labelsTranslations.description,
				}),
			});
	});
	revalidateTag(CACHE_TAGS.SURVEY_LABELS);
}
