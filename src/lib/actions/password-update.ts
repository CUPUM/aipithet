'use server';

import { authorize } from '@lib/auth/auth';
import { hashPassword, verifyPassword } from '@lib/auth/utilities';
import { passwordUpdateSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import * as m from '@translations/messages';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { NEVER } from 'zod';
import { validateFormDataAsync } from './utilities';

export default async function passwordUpdate(state: unknown, formData: FormData) {
	const { user } = await authorize();
	const parsed = await validateFormDataAsync(
		formData,
		passwordUpdateSchema.superRefine(async (data, ctx) => {
			const [dbUser] = await db
				.select({ hashedPassword: users.hashedPassword })
				.from(users)
				.where(eq(users.id, user.id))
				.limit(1);
			if (!dbUser) {
				notFound();
			}
			const validPassword = await verifyPassword(dbUser.hashedPassword, data.currentPassword);
			if (!validPassword) {
				ctx.addIssue({
					path: ['currentPassword'],
					code: 'custom',
					message: m.password_invalid(),
				});
				return NEVER;
			}
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const hashedPassword = await hashPassword(parsed.data.newPassword);
	await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id));
	return parsed.succeed;
}
