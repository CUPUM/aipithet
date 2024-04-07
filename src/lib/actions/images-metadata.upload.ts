'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { images, imagesPrompts, workshopScenarios } from '@lib/database/schema/public';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { toExcluded } from 'drizzle-orm-helpers/pg';
import { NEVER, z } from 'zod';
import { validateFormDataAsync } from './validation';

export default async function imagesMetadataUpload(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('images.pools.update');
	const parsed = await validateFormDataAsync(
		formData,
		z.object({
			poolId: z.string(),
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
						scenarios: z
							.object({
								id: z.string(),
								name: z.string(),
								description: z.string(),
							})
							.array()
							.optional(),
						prompts: z
							.object({
								text: z.string(),
								scenarioId: z.string().optional(),
								method: z.string(),
								images: z
									.object({
										path: z.string(),
										width: z.number(),
										height: z.number(),
									})
									.array(),
							})
							.array(),
					})
				),
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const scenarioIds: Record<string, string> = {};
	await db.transaction(async (tx) => {
		if (parsed.data.file.scenarios) {
			const insertedScenarios = await tx
				.insert(workshopScenarios)
				.values(
					parsed.data.file.scenarios.map(({ id: externalId, ...s }) => ({
						externalId,
						name: s.name,
						description: s.description,
						poolId: parsed.data.poolId,
						createdById: user.id,
					}))
				)
				.onConflictDoUpdate({
					target: [workshopScenarios.name, workshopScenarios.poolId],
					set: toExcluded({
						description: workshopScenarios.description,
						createdById: workshopScenarios.createdById,
					}),
				})
				.returning({ id: workshopScenarios.id, externalId: workshopScenarios.externalId });
			insertedScenarios.forEach((s) => {
				if (s.externalId) {
					scenarioIds[s.externalId] = s.id;
				}
			});
		}
		const promptIds: Record<string, string> = {};
		const insertedPrompts = await tx
			.insert(imagesPrompts)
			.values(
				parsed.data.file.prompts.map((p) => ({
					createdById: user.id,
					method: p.method,
					prompt: p.text,
					poolId: parsed.data.poolId,
					scenarioIds: (p.scenarioId && scenarioIds[p.scenarioId]) ?? undefined,
				}))
			)
			.onConflictDoUpdate({
				target: [imagesPrompts.prompt, imagesPrompts.poolId],
				set: toExcluded({ prompt: imagesPrompts.prompt, method: imagesPrompts.method }),
			})
			.returning({ id: imagesPrompts.id, prompt: imagesPrompts.prompt });
		insertedPrompts.forEach((p) => {
			promptIds[p.prompt] = p.id;
		});
		await tx.insert(images).values(
			parsed.data.file.prompts.flatMap((p) =>
				p.images.map((img) => ({
					poolId: parsed.data.poolId,
					createdById: user.id,
					width: img.width,
					height: img.height,
					storageName: img.path,
					promptId: promptIds[p.text],
				}))
			)
		);
	});
}
