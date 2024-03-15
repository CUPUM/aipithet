'use server';

import { authorize } from '@lib/auth/auth';
import { emailVerificationSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { emailVerificationCodes, users } from '@lib/database/schema/auth';
import { SENDERS } from '@lib/email/constants';
import VerifyEmailTemplate from '@lib/email/templates/verify-email';
import { resend } from '@lib/email/transporter';
import { redirect } from '@lib/i18n/utilities';
import { and, eq, exists, gte } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { excluded, now } from 'drizzle-orm-helpers/pg';

export async function emailVerificationSend() {
	const { user } = await authorize();
	try {
		const [inserted] = await db
			.insert(emailVerificationCodes)
			.values({ userId: user.id, email: user.email })
			.onConflictDoUpdate({
				target: [emailVerificationCodes.userId],
				set: excluded(getColumns(emailVerificationCodes)),
			})
			.returning({
				code: emailVerificationCodes.code,
				expiresAt: emailVerificationCodes.expiresAt,
			});
		if (!inserted) {
			throw new Error('No verification code was returned');
		}
		await resend.emails.send({
			from: SENDERS.DEFAULT,
			to: [user.email],
			subject: 'Verify your email',
			react: VerifyEmailTemplate(inserted),
		});
	} catch (err) {
		console.error(err);
	}
}

export async function emailVerify(state: unknown, formData: FormData) {
	const { user } = await authorize();
	try {
		const data = Object.fromEntries(formData);
		const parsed = emailVerificationSchema.safeParse(data);
		if (!parsed.success) {
			return {
				errors: parsed.error.flatten().fieldErrors,
			};
		}
		const verified = await db.transaction(async (tx) => {
			const [verified] = await tx
				.update(users)
				.set({ emailVerified: true })
				.where(
					and(
						eq(users.id, user.id),
						exists(
							tx
								.select()
								.from(emailVerificationCodes)
								.where(
									and(
										eq(users.id, emailVerificationCodes.userId),
										eq(users.email, emailVerificationCodes.email),
										eq(emailVerificationCodes.code, parsed.data.code),
										gte(emailVerificationCodes.expiresAt, now())
									)
								)
						)
					)
				)
				.returning();
			if (verified) {
				await tx.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, user.id));
			}
			return verified;
		});
		if (!verified) {
			return {
				message: 'Email could not be verified.',
			};
		}
	} catch (err) {
		console.error(err);
		throw new Error('Error when trying to verify email.');
	}
	return redirect('/');
}
