'use server';

import { authorize } from '@lib/auth/auth';
import { passwordUpdateSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import { languageTagServer } from '@lib/i18n/utilities-server';
import * as m from '@translations/messages';
import { setLanguageTag } from '@translations/runtime';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { NEVER } from 'zod';
import { validateFormDataAsync } from '../validation';

export default async function passwordUpdate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	const parsed = await validateFormDataAsync(
		formData,
		passwordUpdateSchema.superRefine(async (data, ctx) => {
			const [dbUser] = await db
				.select({ hashedPassword: users.hashedPassword })
				.from(users)
				.where(eq(users.id, user.id))
				.limit(1);
			if (!dbUser) {
				notFound();
			}
			const validPassword = await new Argon2id().verify(
				dbUser.hashedPassword,
				data.currentPassword
			);
			if (!validPassword) {
				ctx.addIssue({
					path: ['currentPassword'],
					code: 'custom',
					message: m.password_invalid(),
				});
				return NEVER;
			}
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const hashedPassword = await new Argon2id().hash(parsed.data.newPassword);
	await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id));
	return parsed.succeed;
}
