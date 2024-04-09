'use server';

import { auth } from '@lib/auth/auth';
import { passwordResetFinalizeSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { passwordResetTokens, users } from '@lib/database/schema/auth';
import { redirect } from '@lib/i18n/utilities-server';
import * as m from '@translations/messages';
import { and, eq, gte } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { validateFormData } from '../validation';

export default async function passwordResetFinalize(state: unknown, formData: FormData) {
	const parsed = validateFormData(formData, passwordResetFinalizeSchema);
	if (!parsed.success) {
		return parsed.fail;
	}
	const [updated] = await db.transaction(async (tx) => {
		const [tokenUser] = await tx
			.delete(passwordResetTokens)
			.where(
				and(
					eq(passwordResetTokens.token, parsed.data.token),
					gte(passwordResetTokens.expiresAt, now())
				)
			)
			.returning({ id: passwordResetTokens.userId });
		if (!tokenUser) {
			throw new Error(m.password_reset_token_invalid());
		}
		const hashedPassword = await new Argon2id().hash(parsed.data.newPassword);
		return await tx
			.update(users)
			.set({ hashedPassword, updatedAt: now() })
			.where(eq(users.id, tokenUser.id))
			.returning({ id: users.id });
	});
	if (!updated) {
		throw new Error('No matching user found when trying to update password.');
	}
	const session = await auth.createSession(updated.id, {});
	const sessionCookie = auth.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	redirect('/');
}
