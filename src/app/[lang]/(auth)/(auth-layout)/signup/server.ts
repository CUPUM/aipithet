'use server';

import { auth } from '@lib/auth/auth';
import { emailPasswordSignupSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { emailConfirmationCodes, users } from '@lib/database/schema/auth';
import { resend } from '@lib/email/send';
import VerifyEmailTemplate from '@lib/email/templates/verify-email';
import { redirect } from '@lib/i18n/utilities';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';

export async function signup(state: unknown, formData: FormData) {
	try {
		const data = Object.fromEntries(formData);
		const parsed = emailPasswordSignupSchema.safeParse(data);
		if (!parsed.success) {
			return {
				errors: parsed.error.flatten().fieldErrors,
			};
		}
		const [existingUser] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, parsed.data.email))
			.limit(1);
		if (existingUser) {
			return {
				message: 'Email already used',
				type: 'error',
			};
		}
		const hashedPassword = await new Argon2id().hash(parsed.data.password);
		const { id, code } = await db.transaction(async (tx) => {
			const [{ id }] = await tx
				.insert(users)
				.values({
					hashedPassword,
					email: parsed.data.email,
				})
				.returning({ id: users.id });
			const expiresAt = new Date();
			expiresAt.setMinutes(expiresAt.getMinutes() + 5);
			const [{ code }] = await tx
				.insert(emailConfirmationCodes)
				.values({ userId: id, email: parsed.data.email, expiresAt })
				.returning({ code: emailConfirmationCodes.code });
			return { id, code };
		});
		const session = await auth.createSession(id, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		await resend.emails.send({
			from: 'Aipithet <aipithet@resend.com>',
			to: [parsed.data.email],
			subject: 'Verify your email',
			react: VerifyEmailTemplate({ code }),
		});
	} catch (err) {
		console.error(err);
		throw new Error('Database error while trying to create new user. :(');
	}
	return redirect('/verify-email');
}
