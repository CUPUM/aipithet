'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveysPairs } from '@lib/database/schema/public';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { NEVER, z } from 'zod';
import { validateFormDataAsync } from './validation';

export default async function imagePairsUpload(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize(); // TODO: Add permission
	const parsed = await validateFormDataAsync(
		formData,
		z.object({
			chapterId: z.string(),
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
								promptId: z.string(),
								image1: z.string(),
								image2: z.string(),
								criteria1: z.string(),
								criteria2: z.string(),
								criteria3: z.string(),
								numAnnotators: z.number(),
							})
							.array(),
					})
				),
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}

	const addedPairs = await db.transaction(async (tx) => {
		await tx
			.insert(labelingSurveysPairs)
			.values(
				parsed.data.file.pairs.map((p) => ({
					promptId: p.promptId,
					image1Id: p.image1,
					image2Id: p.image2,
					label1Id: p.criteria1,
					label2Id: p.criteria2,
					label3Id: p.criteria3,
					maxAnswersCount: p.numAnnotators,
					chapterId: parsed.data.chapterId,
					generationMethod: 'static',
				}))
			)
			.returning({
				id: labelingSurveysPairs.id,
			});
	});
	return { addedPairs };
}
