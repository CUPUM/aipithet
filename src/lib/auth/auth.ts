import { db } from '@/lib/database/db';
import { sessions, users } from '@/lib/database/schema/auth';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { InferSelectModel } from 'drizzle-orm';
import { Lucia } from 'lucia';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes(databaseUserAttributes) {
		return {
			id: databaseUserAttributes.id,
			role: databaseUserAttributes.role,
			email: databaseUserAttributes.email,
			emailVerified: databaseUserAttributes.email_verified,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: Pick<
			InferSelectModel<typeof users, { dbColumnNames: true }>,
			'id' | 'email' | 'email_verified' | 'role'
		>;
	}
}
