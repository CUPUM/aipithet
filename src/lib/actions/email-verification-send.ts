'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { emailVerificationCodes } from '@lib/database/schema/auth';
import { SENDERS } from '@lib/email/constants';
import { transporter } from '@lib/email/email';
import VerifyEmailTemplate from '@lib/email/templates/verify-email';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { render } from '@react-email/render';
import { setLanguageTag } from '@translations/runtime';
import { getColumns } from 'drizzle-orm-helpers';
import { toExcluded } from 'drizzle-orm-helpers/pg';

export default async function emailVerificationSend() {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	try {
		const [inserted] = await db
			.insert(emailVerificationCodes)
			.values({ userId: user.id, email: user.email })
			.onConflictDoUpdate({
				target: [emailVerificationCodes.userId],
				set: toExcluded(getColumns(emailVerificationCodes)),
			})
			.returning({
				code: emailVerificationCodes.code,
				expiresAt: emailVerificationCodes.expiresAt,
			});
		if (!inserted) {
			throw new Error('No verification code was returned');
		}
		await transporter.sendMail({
			from: SENDERS.DEFAULT,
			to: [user.email],
			subject: 'Verify your email',
			html: render(VerifyEmailTemplate(inserted)),
		});
	} catch (err) {
		console.error(err);
	}
}
