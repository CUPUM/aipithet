'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { imagesPoolsTranslations } from '@lib/database/schema/public';
import { imagesPoolsWithTranslationsSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { canEditImagePool } from '@lib/queries/queries';
import { setLanguageTag } from '@translations/runtime';
import { getColumns } from 'drizzle-orm-helpers';
import { toExcluded } from 'drizzle-orm-helpers/pg';
import { revalidateTag } from 'next/cache';
import { validateFormData } from './validation';

export default async function imagePoolPresentationUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	const parsed = validateFormData(formData, imagesPoolsWithTranslationsSchema.shape.translations);
	if (!parsed.success) {
		return parsed.fail;
	}
	await db.transaction(async (tx) => {
		await tx
			.insert(imagesPoolsTranslations)
			.values(Object.values(parsed.data))
			.onConflictDoUpdate({
				where: canEditImagePool({
					userId: user.id,
					poolId: imagesPoolsTranslations.id,
				}),
				target: [imagesPoolsTranslations.id, imagesPoolsTranslations.lang],
				set: toExcluded(getColumns(imagesPoolsTranslations)),
			});
	});
	revalidateTag(CACHE_TAGS.IMAGE_POOL_PRESENTATION);
	return parsed.succeed;
}
