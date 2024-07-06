'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveysPairs, labels } from '@lib/database/schema/public';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { validateFormDataAsync } from './validation';

export default async function imagePairsUpload(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize(); // TODO: Add permission
	const parsed = await validateFormDataAsync(
		formData,
		z.object({
			chapterId: z.string(),
			surveyId: z.string(),
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}

	const allPairs = await db
		.select()
		.from(labelingSurveysPairs)
		.where(and(eq(labelingSurveysPairs.chapterId, parsed.data.chapterId)));

	if (!allPairs) {
		return {
			success: false,
			fail: {
				chapterId: ['Chapter not found'],
			},
		};
	}

	const allCriteria = await db.select().from(labels);

	if (!allCriteria) {
		return {
			success: false,
			fail: {
				surveyId: ['Survey not found'],
			},
		};
	}

	const allCriteriaSurvey = allCriteria.filter(
		(criteria) => criteria.surveyId === parsed.data.surveyId
	);

	const updatedPairs = await db.transaction(async (tx) => {
		const updatedPairs = [];
		for (const pair of allPairs) {
			const originalCriteria1 = allCriteria.find((criteria) => criteria.id === pair.label1Id);
			const originalCriteria2 = allCriteria.find((criteria) => criteria.id === pair.label2Id);
			const originalCriteria3 = allCriteria.find((criteria) => criteria.id === pair.label3Id);
			if (!originalCriteria1 || !originalCriteria2 || !originalCriteria3) {
				throw new Error('Criteria not found');
			}

			const criteria1 = allCriteriaSurvey.find(
				(c) => c.externalId === originalCriteria1.externalId
			);
			const criteria2 = allCriteriaSurvey.find(
				(c) => c.externalId === originalCriteria2.externalId
			);
			const criteria3 = allCriteriaSurvey.find(
				(c) => c.externalId === originalCriteria3.externalId
			);
			if (!criteria1 || !criteria2 || !criteria3) {
				throw new Error('Criteria not found');
			}

			const updatedPair = await tx
				.update(labelingSurveysPairs)
				.set({
					label1Id: criteria1.id,
					label2Id: criteria2.id,
					label3Id: criteria3.id,
				})
				.where(
					and(
						eq(labelingSurveysPairs.chapterId, parsed.data.chapterId),
						eq(labelingSurveysPairs.id, pair.id)
					)
				);
			updatedPairs.push(updatedPair);
		}
		return updatedPairs;
	});
}
