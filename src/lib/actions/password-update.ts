'use server';

import { authorize } from '@lib/auth/auth';
import { hashPassword } from '@lib/auth/utilities';
import { passwordUpdateSchema } from '@lib/auth/validation';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import { eq } from 'drizzle-orm';
import { validateFormDataAsync } from './utilities';

export default async function passwordUpdate(state: unknown, formData: FormData) {
	const { user } = await authorize();
	const parsed = await validateFormDataAsync(
		formData,
		passwordUpdateSchema.transform((data) => {
			return data;
		})
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const hashedPassword = await hashPassword(parsed.data.newPassword);
	await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id));
}
