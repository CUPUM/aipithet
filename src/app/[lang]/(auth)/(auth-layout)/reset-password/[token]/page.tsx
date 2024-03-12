import { auth } from '@lib/auth/auth';
import { validate } from '@lib/auth/authorization';
import { hashPassword } from '@lib/auth/utilities';
import { finalizePasswordResetSchema } from '@lib/auth/validation';
import { Button, ButtonIcon } from '@lib/components/primitives/button';
import { db } from '@lib/database/db';
import { passwordResetTokens, users } from '@lib/database/schema/auth';
import Link from '@lib/i18n/Link';
import { redirect } from '@lib/i18n/utilities';
import * as m from '@translations/messages';
import { and, eq, gte } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';
import { LogIn, UserPlus } from 'lucide-react';
import { cookies } from 'next/headers';
import { BackButton, FinalizePasswordResetForm } from './client';

export function finalizePasswordReset(token: string) {
	return async function finalizePasswordReset(state: unknown, formData: FormData) {
		'use server';
		formData.set('token', decodeURIComponent(token));
		const data = Object.entries(formData);
		const parsed = finalizePasswordResetSchema.safeParse(data);
		if (!parsed.success) {
			return { errors: parsed.error.format() };
		}
		const [updated] = await db.transaction(async (tx) => {
			const [tokenUser] = await tx
				.delete(passwordResetTokens)
				.where(
					and(
						eq(passwordResetTokens.token, parsed.data.token),
						gte(passwordResetTokens.expiresAt, now())
					)
				)
				.returning({ id: passwordResetTokens.userId });
			if (!tokenUser) {
				throw new Error(m.password_reset_token_invalid());
			}
			const hashedPassword = await hashPassword(parsed.data.newPassword);
			return await tx
				.update(users)
				.set({ hashedPassword, updatedAt: now() })
				.where(eq(users.id, tokenUser.id))
				.returning({ id: users.id });
		});
		if (!updated) {
			throw new Error('No matching user found when trying to update password.');
		}
		const session = await auth.createSession(updated.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		redirect('/i');
	};
}

export default async function Page(props: { params: { token: string } }) {
	const { user } = await validate();
	if (user) {
		redirect('/i/settings#password');
	}

	return (
		<>
			<section className="mb-4 flex flex-row flex-wrap gap-2 justify-between animate-fly-up">
				<BackButton />
			</section>
			<FinalizePasswordResetForm formAction={finalizePasswordReset(props.params.token)} />
			<section className="mt-4 flex flex-row flex-wrap gap-2 justify-between animate-fly-down">
				<Button asChild variant="link" size="sm">
					<Link href="/signup">
						<ButtonIcon icon={UserPlus} />
						{m.signup()}
					</Link>
				</Button>
				<Button asChild variant="link" size="sm">
					<Link href="/login">
						{m.login()}
						<ButtonIcon icon={LogIn} />
					</Link>
				</Button>
			</section>
		</>
	);
}
