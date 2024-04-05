'use server';

import { passwordResetSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { passwordResetTokens, users } from '@lib/database/schema/auth';
import { SENDERS } from '@lib/email/constants';
import { transporter } from '@lib/email/email';
import ResetPasswordTemplate from '@lib/email/templates/reset-password';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { render } from '@react-email/render';
import * as m from '@translations/messages';
import { setLanguageTag } from '@translations/runtime';
import { eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { toExcluded } from 'drizzle-orm-helpers/pg';

export default async function passwordReset(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	try {
		const data = Object.fromEntries(formData);
		const parsed = passwordResetSchema.safeParse(data);
		if (!parsed.success) {
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
		const [inserted] = await db
			.insert(passwordResetTokens)
			.values({ userId: user.id })
			.onConflictDoUpdate({
				target: [passwordResetTokens.userId],
				set: toExcluded(getColumns(passwordResetTokens)),
			})
			.returning({
				token: passwordResetTokens.token,
				expiresAt: passwordResetTokens.expiresAt,
			});
		if (!inserted) {
			throw new Error('No inserted password reset row was returned.');
		}
		await transporter.sendMail({
			from: SENDERS.DEFAULT,
			to: [parsed.data.email],
			subject: m.reset_password_email_subject(),
			html: render(ResetPasswordTemplate(inserted)),
		});
	} catch (err) {
		console.error(err);
		throw new Error('Error when trying to reset password.');
	}
	return {
		finalize: true,
	};
}
