'use server';

import { auth } from '@lib/auth/auth';
import { emailPasswordLoginSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import { redirect } from '@lib/i18n/utilities';
import { eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';

export async function login(state: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);
	const parsed = emailPasswordLoginSchema.safeParse(data);
	if (!parsed.success) {
		return {
			errors: parsed.error.flatten().fieldErrors,
		};
	}
	try {
		const { id, emailVerified, role, hashedPassword } = getColumns(users);
		const [user] = await db
			.select({ emailVerified, id, role, hashedPassword })
			.from(users)
			.where(eq(users.email, parsed.data.email));
		if (!user) {
			return {
				message: 'Invalid email or password',
				type: 'error',
			};
		}
		const validPassword = await new Argon2id().verify(user.hashedPassword, parsed.data.password);
		if (!validPassword) {
			return {
				message: 'Invalid email or password',
				type: 'error',
			};
		}
		const session = await auth.createSession(user.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		if (!user.emailVerified) {
			return redirect('/verify-email');
		}
		return redirect('/');
	} catch (err) {
		throw new Error('Server error when attempting to login.');
	}
}
