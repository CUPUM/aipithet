'use server';

import { auth } from '@lib/auth/auth';
import { verifyPassword } from '@lib/auth/utilities';
import { emailPasswordLoginSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import { redirect } from '@lib/i18n/utilities';
import * as m from '@translations/messages';
import { eq } from 'drizzle-orm';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { cookies } from 'next/headers';
import { NEVER, ZodIssueCode } from 'zod';

export async function login(state: unknown, formData: FormData) {
	try {
		const data = Object.fromEntries(formData);
		const parsed = await emailPasswordLoginSchema
			.transform(async (data, ctx) => {
				const [user] = await db
					.select({
						emailVerified: users.emailVerified,
						id: users.id,
						role: users.role,
						hashedPassword: users.hashedPassword,
					})
					.from(users)
					.where(eq(users.email, data.email));
				if (!user) {
					ctx.addIssue({
						code: ZodIssueCode.custom,
						message: m.login_invalid_credentials(),
					});
					return NEVER;
				}
				const validPassword = await verifyPassword(user.hashedPassword, data.password);
				if (!validPassword) {
					ctx.addIssue({
						code: ZodIssueCode.custom,
						message: m.login_invalid_credentials(),
					});
					return NEVER;
				}
				return user;
			})
			.safeParseAsync(data);
		if (!parsed.success) {
			return {
				errors: parsed.error.format(),
			};
		}
		const session = await auth.createSession(parsed.data.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		if (!parsed.data.emailVerified) {
			redirect('/verify-email');
		}
		redirect('/i');
	} catch (err) {
		if (isRedirectError(err)) {
			throw err;
		}
		throw new Error('Server error when attempting to login.');
	}
}
