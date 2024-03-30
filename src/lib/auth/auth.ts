import { db } from '@lib/database/db';
import { sessions, users } from '@lib/database/schema/auth';
import { redirect } from '@lib/i18n/utilities-server';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import * as m from '@translations/messages';
import type { InferSelectModel } from 'drizzle-orm';
import { Lucia } from 'lucia';
import { cookies } from 'next/headers';
import { RedirectType } from 'next/navigation';
import { cache } from 'react';
import type { PermissionKey } from './constants';
import { isAllowed } from './utilities';

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

export const validate = cache(async () => {
	const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null;
	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}
	const result = await auth.validateSession(sessionId);
	try {
		if (result.session && result.session.fresh) {
			const sessionCookie = auth.createSessionCookie(result.session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!result.session) {
			const sessionCookie = auth.createBlankSessionCookie();
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {
		// next.js throws when you attempt to set cookie when rendering page
	}
	return result;
});

/**
 * Authorize a request, i.e. throw an error if no session/user is authenticated. Whenever a
 * permission key is provided, throw an error if user lacks required role.
 *
 * @returns User and Session if found, else the default behavior throws a redirect to the `/login`
 *   route.
 */
export const authorize = cache(async (key?: PermissionKey, message?: string) => {
	'use server';
	const validated = await validate();
	if (!validated.user) {
		return redirect('/login', RedirectType.push);
	}
	if (!isAllowed(validated.user, key)) {
		throw new Error(message ?? m.insufficient_permissions());
	}
	return validated;
});
