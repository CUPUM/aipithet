import { authorize } from '@lib/auth/authorization';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import * as m from '@translations/messages';
import { and, eq } from 'drizzle-orm';
import { BackButton, VerifyEmailForm } from './client';

export default async function Page() {
	const { user } = await authorize();
	const [verified] = await db
		.select({ emailVerified: users.emailVerified })
		.from(users)
		.where(and(eq(users.id, user.id), eq(users.emailVerified, true)))
		.limit(1);
	if (verified) {
		return (
			<article className="flex flex-col items-center gap-8">
				<div className="absolute text-9xl -z-10 -translate-y-1/2 opacity-10">🎉</div>
				<p className="text-center">{m.email_already_verified()}</p>
				<BackButton />
			</article>
		);
	}
	return <VerifyEmailForm />;
}
