'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { imagesPoolsInvitations } from '@lib/database/schema/public';
import { imagesPoolsInvitationsSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { langSchema } from '@lib/i18n/validation';
import { setLanguageTag } from '@translations/runtime';
import { revalidateTag } from 'next/cache';
import { validateFormData } from './validation';

export default async function imagePoolEditorInvite(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	await authorize('images.pools.update');
	const parsed = validateFormData(
		formData,
		imagesPoolsInvitationsSchema.extend({ preferredLang: langSchema })
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	await db.transaction(async (tx) => {
		const [inserted] = await tx.insert(imagesPoolsInvitations).values(parsed.data).returning();
		if (!inserted) {
			return tx.rollback();
		}
		// Send email
	});
	revalidateTag(CACHE_TAGS.IMAGE_POOL_EDITORS);
}
