import { authorize } from '@lib/auth/authorization';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import Link from '@lib/i18n/Link';
import { and, eq, not } from 'drizzle-orm';
import { VerifyEmailForm } from './client';

export default async function Page() {
	const { user } = await authorize();
	const [{ emailVerified }] = await db
		.select({ emailVerified: users.emailVerified })
		.from(users)
		.where(and(eq(users.id, user.id), not(eq(users.emailVerified, true))))
		.limit(1);
	if (emailVerified) {
		<article>
			Congratulations, your email is already verified!
			<Link href="/">Return to home</Link>
		</article>;
	}
	return <VerifyEmailForm />;
}
