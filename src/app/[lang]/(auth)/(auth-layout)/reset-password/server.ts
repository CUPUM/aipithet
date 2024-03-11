'use server';

import { passwordResetSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { passwordResets, users } from '@lib/database/schema/auth';
import ResetPasswordTemplate from '@lib/email/templates/reset-password';
import { resend } from '@lib/email/transporter';
import * as m from '@translations/messages';
import { eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { excluded } from 'drizzle-orm-helpers/pg';

export async function resetPassword(state: unknown, formData: FormData) {
	try {
		const data = Object.fromEntries(formData);
		const parsed = passwordResetSchema.safeParse(data);
		if (!parsed.success) {
			console.log(parsed.error.format());
			return {
				errors: parsed.error.format(),
			};
		}
		const [user] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, parsed.data.email))
			.limit(1);
		if (!user) {
			return {
				reset: true,
			};
		}
		console.log(
			db
				.insert(passwordResets)
				.values({ userId: user.id })
				.onConflictDoUpdate({
					target: [passwordResets.userId],
					set: excluded(getColumns(passwordResets)),
				})
				.returning({
					temporaryPassword: passwordResets.temporaryPassword,
					expiresAt: passwordResets.expiresAt,
				})
				.toSQL().sql
		);
		const [{ temporaryPassword, expiresAt }] = await db
			.insert(passwordResets)
			.values({ userId: user.id })
			.onConflictDoUpdate({
				target: [passwordResets.userId],
				set: excluded(getColumns(passwordResets)),
			})
			.returning({
				temporaryPassword: passwordResets.temporaryPassword,
				expiresAt: passwordResets.expiresAt,
			});
		await resend.emails.send({
			from: `Aipithet <${process.env.RESEND_DOMAIN}>`,
			to: [parsed.data.email],
			subject: m.reset_password_email_subject(),
			react: ResetPasswordTemplate({ temporaryPassword, expiresAt }),
		});
		return {
			reset: true,
		};
	} catch (err) {
		console.error(err);
		throw new Error('Error when trying to reset password.');
	}
}
