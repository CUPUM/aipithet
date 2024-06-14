'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	images,
	imagesPrompts,
	imagesPromptsRelation,
	workshopScenarios,
} from '@lib/database/schema/public';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { toExcluded } from 'drizzle-orm-helpers/pg';
import path from 'node:path';
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
						bucket: z.string(),
						prefix: z.string().optional(),
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
								id: z.string(),
								text: z.string(),
								scenarioId: z.string().optional(),
								method: z.string(),
							})
							.array(),
						relations: z
							.object({
								parentId: z.string(),
								childId: z.string(),
								modification: z.string().optional(),
							})
							.array(),
						images: z
							.object({
								id: z.string(),
								promptId: z.string(),
								name: z.string(),
								path: z.string(),
								width: z.coerce.number(),
								height: z.coerce.number(),
							})
							.array(),
					})
				),
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}

	const addedImages = await db.transaction(async (tx) => {
		const scenarioIds: Record<string, string> = {};
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
						updatedById: user.id,
					}))
				)
				.onConflictDoUpdate({
					target: [workshopScenarios.name, workshopScenarios.poolId],
					set: toExcluded({
						description: workshopScenarios.description,
						updatedById: workshopScenarios.updatedById,
					}),
				})
				.returning({
					id: workshopScenarios.id,
					externalId: workshopScenarios.externalId,
				});

			insertedScenarios.forEach((s) => {
				if (!s.externalId) {
					throw new Error('Scenario id is missing');
				}
				if (s.externalId in insertedScenarios) {
					throw new Error('Duplicate scenario id');
				}
				scenarioIds[s.externalId] = s.id;
			});
		}
		console.log('scenarios ok');

		const insertedPrompts = await tx
			.insert(imagesPrompts)
			.values(
				parsed.data.file.prompts.map((p) => ({
					externalId: p.id,
					createdById: user.id,
					updatedById: user.id,
					method: p.method,
					prompt: p.text,
					poolId: parsed.data.poolId,
					scenarioIds: (p.scenarioId && scenarioIds[p.scenarioId]) ?? undefined,
				}))
			)
			.onConflictDoNothing({
				target: [imagesPrompts.prompt, imagesPrompts.poolId, imagesPrompts.method],
			})
			.returning({
				id: imagesPrompts.id,
				externalId: imagesPrompts.externalId,
				prompt: imagesPrompts.prompt,
				method: imagesPrompts.method,
			});

		const promptIds: Record<string, string> = {};
		insertedPrompts.forEach((p) => {
			if (!p.externalId) {
				throw new Error('Prompt id is missing');
			}
			if (p.externalId in promptIds) {
				throw new Error('Duplicate prompt id');
			}
			promptIds[p.externalId] = p.id;
		});

		console.log('prompts ok');

		const insertedRelations = await tx
			.insert(imagesPromptsRelation)
			.values(
				parsed.data.file.relations.map((r) => ({
					parentPromptId: promptIds[r.parentId],
					childPromptId: promptIds[r.childId],
					modification: r.modification,
				}))
			)
			.onConflictDoNothing({
				target: [imagesPromptsRelation.parentPromptId, imagesPromptsRelation.childPromptId],
			})
			.returning({
				parentPromptId: imagesPromptsRelation.parentPromptId,
				childPromptId: imagesPromptsRelation.childPromptId,
			});

		console.log('relations ok');

		return await tx
			.insert(images)
			.values(
				parsed.data.file.images.map((img) => ({
					externalId: img.id,
					poolId: parsed.data.poolId,
					createdById: user.id,
					updatedById: user.id,
					width: img.width,
					height: img.height,
					path: path.join(parsed.data.file.prefix ?? '', `${img.id}.${path.extname(img.name)}`),
					bucket: parsed.data.file.bucket,
					promptId: promptIds[img.promptId],
				}))
			)
			.onConflictDoUpdate({
				target: [images.poolId, images.path, images.bucket],
				set: toExcluded({
					promptId: images.promptId,
					updatedById: images.updatedById,
					width: images.width,
					height: images.height,
				}),
			})
			.returning({ id: images.id });
	});
	return { addedImages };
}
