'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { emailVerificationCodes } from '@lib/database/schema/auth';
import { SENDERS } from '@lib/email/constants';
import { resend } from '@lib/email/resend';
import VerifyEmailTemplate from '@lib/email/templates/verify-email';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { getColumns } from 'drizzle-orm-helpers';
import { excluded } from 'drizzle-orm-helpers/pg';

export default async function emailVerificationSend() {
	setLanguageTag(languageTagServer);
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
