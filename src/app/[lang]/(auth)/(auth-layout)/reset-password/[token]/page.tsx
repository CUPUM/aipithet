import { auth, validate } from '@lib/auth/auth';
import { passwordResetFinalizeSchema } from '@lib/auth/validation';
import ButtonBack from '@lib/components/button-back';
import { Button, ButtonIcon, ButtonIconSpace } from '@lib/components/primitives/button';
import { db } from '@lib/database/db';
import { passwordResetTokens, users } from '@lib/database/schema/auth';
import Link from '@lib/i18n/Link';
import { redirect } from '@lib/i18n/utilities-server';
import * as m from '@translations/messages';
import { and, eq, gte } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { PasswordResetFinalizeForm } from './client';

export function passwordResetFinalize(token: string) {
	return async function finalizePasswordReset(state: unknown, formData: FormData) {
		'use server';
		formData.set('token', decodeURIComponent(token));
		const data = Object.fromEntries(formData);
		const parsed = passwordResetFinalizeSchema.safeParse(data);
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
			const hashedPassword = await new Argon2id().hash(parsed.data.newPassword);
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
		redirect('/settings#password');
	}

	return (
		<>
			<section className="mb-4 flex animate-fly-up flex-row flex-wrap justify-between gap-2">
				<ButtonBack size="sm" variant="link">
					<ButtonIcon icon={ArrowLeft} />
					{m.go_back()}
					<ButtonIconSpace />
				</ButtonBack>
			</section>
			<PasswordResetFinalizeForm formAction={passwordResetFinalize(props.params.token)} />
			<section className="mt-4 flex animate-fly-down flex-row flex-wrap justify-between gap-2">
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
