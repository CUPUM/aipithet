'use server';

import { auth } from '@lib/auth/auth';
import { hashPassword } from '@lib/auth/utilities';
import { emailPasswordSignupSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { emailVerificationCodes, users } from '@lib/database/schema/auth';
import { SENDERS } from '@lib/email/constants';
import VerifyEmailTemplate from '@lib/email/templates/verify-email';
import { resend } from '@lib/email/transporter';
import { redirect } from '@lib/i18n/utilities';
import * as m from '@translations/messages';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { ZodIssueCode } from 'zod';

export default async function signup(state: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);
	const parsed = await emailPasswordSignupSchema
		.superRefine(async (data, ctx) => {
			const [existingUser] = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.email, data.email))
				.limit(1);
			if (existingUser) {
				ctx.addIssue({
					message: m.signup_credentials_unavailable(),
					code: ZodIssueCode.invalid_string,
					path: ['email'],
					validation: 'email',
				});
			}
		})
		.safeParseAsync(data);
	if (!parsed.success) {
		return { errors: parsed.error.format() };
	}
	const hashedPassword = await hashPassword(parsed.data.password);
	const { id, code, expiresAt } = await db.transaction(async (tx) => {
		const [inserted] = await tx
			.insert(users)
			.values({
				hashedPassword,
				email: parsed.data.email,
			})
			.returning({ id: users.id });
		if (!inserted) {
			return tx.rollback();
		}
		const [verification] = await tx
			.insert(emailVerificationCodes)
			.values({ userId: inserted.id, email: parsed.data.email })
			.returning({
				code: emailVerificationCodes.code,
				expiresAt: emailVerificationCodes.expiresAt,
			});
		if (!verification) {
			return tx.rollback();
		}
		return { ...inserted, ...verification };
	});
	const session = await auth.createSession(id, {});
	const sessionCookie = auth.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	await resend.emails.send({
		from: SENDERS.DEFAULT,
		to: [parsed.data.email],
		subject: 'Verify your email',
		react: VerifyEmailTemplate({ code, expiresAt }),
	});
	return redirect('/verify-email');
}
