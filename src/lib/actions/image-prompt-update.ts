'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { imagesPrompts } from '@lib/database/schema/public';
import { imagesPromptsSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { canEditImagePool } from '@lib/queries/queries';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { validateFormData } from './validation';

export default async function imagePromptUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('images.pools.update');
	const parsed = validateFormData(formData, imagesPromptsSchema.required({ id: true }));
	if (!parsed.success) {
		return parsed.fail;
	}
	await db
		.update(imagesPrompts)
		.set(parsed.data)
		.where(
			and(
				eq(imagesPrompts.id, parsed.data.id),
				canEditImagePool({ userId: user.id, poolId: imagesPrompts.poolId })
			)
		);
	revalidateTag(CACHE_TAGS.IMAGE_PROMPT);
}
