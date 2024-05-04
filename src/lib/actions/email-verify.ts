'use server';

import { authorize } from '@lib/auth/auth';
import { emailVerificationSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { emailVerificationCodes, users } from '@lib/database/schema/auth';
import { languageTagServer, redirect } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { and, eq, exists, gte } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';

export default async function emailVerify(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
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
	return redirect('/surveys');
}
