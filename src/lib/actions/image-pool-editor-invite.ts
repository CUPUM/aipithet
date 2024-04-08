'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import {
	imagesPoolsEditors,
	imagesPoolsInvitations,
	imagesPoolsTranslations,
} from '@lib/database/schema/public';
import { imagesPoolsInvitationsSchema } from '@lib/database/validation';
import { SENDERS } from '@lib/email/constants';
import { transporter } from '@lib/email/email';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { langSchema } from '@lib/i18n/validation';
import * as m from '@translations/messages';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
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
	const [poolText] = await db
		.select({ title: imagesPoolsTranslations.title })
		.from(imagesPoolsTranslations)
		.where(
			and(
				eq(imagesPoolsTranslations.id, parsed.data.imagePoolId),
				eq(imagesPoolsTranslations.lang, parsed.data.preferredLang)
			)
		)
		.limit(1);
	const [existingUser] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, parsed.data.email))
		.limit(1);
	await db.transaction(async (tx) => {
		if (existingUser) {
			const [added] = await tx
				.insert(imagesPoolsEditors)
				.values({ userId: existingUser.id, imagePoolId: parsed.data.imagePoolId })
				.onConflictDoNothing()
				.returning();
			if (!added) {
				return tx.rollback();
			}
			await transporter.sendMail({
				from: SENDERS.IMAGE_POOL,
				to: parsed.data.email,
				subject: m.image_pool_joined_editor_email_title(),
			});
			return;
		}
		const [invited] = await tx.insert(imagesPoolsInvitations).values(parsed.data).returning();
		if (!invited) {
			return tx.rollback();
		}
		await transporter.sendMail({
			from: SENDERS.IMAGE_POOL,
			to: parsed.data.email,
			subject: m.image_pool_invited_editor_email_title(),
		});
	});
	revalidateTag(CACHE_TAGS.IMAGE_POOL_EDITORS);
}
