'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { images, labelingSurveysPairs, labels } from '@lib/database/schema/public';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { inArray } from 'drizzle-orm';
import { NEVER, z } from 'zod';
import { validateFormDataAsync } from './validation';

export default async function imagePairsUpload(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize(); // TODO: Add permission
	const parsed = await validateFormDataAsync(
		formData,
		z.object({
			chapterId: z.string(),
			surveyId: z.string(),
			file: z
				.instanceof(Blob)
				.transform(async (d, ctx) => {
					try {
						const json = await JSON.parse(await d.text());
						return json;
					} catch (err) {
						ctx.addIssue({
							path: ['file'],
							code: 'custom',
							message: 'File could not be parsed due to invalid json format.',
						});
						return NEVER;
					}
				})
				.pipe(
					z.object({
						pairs: z
							.object({
								image1: z.string(),
								image2: z.string(),
								criteria1: z.string(),
								criteria2: z.string(),
								criteria3: z.string(),
								numAnnotators: z.number(),
								type: z.string(),
							})
							.array(),
					})
				),
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}

	const allImages = await db
		.select({ id: images.id, externalId: images.externalId, promptId: images.promptId })
		.from(images)
		.where(
			inArray(images.externalId, [
				...new Set(parsed.data.file.pairs.flatMap((p) => [p.image1, p.image2])),
			])
		);

	const allCriterias = await db
		.select({ id: labels.id, externalId: labels.externalId })
		.from(labels)
		.where(
			inArray(labels.externalId, [
				...new Set(parsed.data.file.pairs.flatMap((p) => [p.criteria1, p.criteria2, p.criteria3])),
			])
		);

	const addedPairs = await db.transaction(async (tx) => {
		await tx
			.insert(labelingSurveysPairs)
			.values(
				parsed.data.file.pairs.map((p) => {
					const image1 = allImages.find((i) => i.externalId === p.image1);
					const image2 = allImages.find((i) => i.externalId === p.image2);

					if (!image1 || !image2) {
						throw new Error('Image not found');
					}

					const criteria1 = allCriterias.find((c) => c.externalId === p.criteria1);
					const criteria2 = allCriterias.find((c) => c.externalId === p.criteria2);
					const criteria3 = allCriterias.find((c) => c.externalId === p.criteria3);

					if (!criteria1 || !criteria2 || !criteria3) {
						throw new Error('Criteria not found');
					}

					const promptId = image1.promptId;
					if (!promptId) {
						throw new Error('Prompt not found');
					}

					return {
						promptId: promptId,
						image1Id: image1.id,
						image2Id: image2.id,
						label1Id: criteria1.id,
						label2Id: criteria2.id,
						label3Id: criteria3.id,
						maxAnswersCount: p.numAnnotators,
						chapterId: parsed.data.chapterId,
						generationMethod: 'static',
						type: p.type,
					};
				})
			)
			.returning({
				id: labelingSurveysPairs.id,
			});
	});
	return { addedPairs };
}
