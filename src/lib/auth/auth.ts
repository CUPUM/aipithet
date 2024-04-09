import { db } from '@lib/database/db';
import { sessions, users } from '@lib/database/schema/auth';
import { redirect } from '@lib/i18n/utilities-server';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import * as m from '@translations/messages';
import type { InferSelectModel } from 'drizzle-orm';
import { Lucia } from 'lucia';
import { cookies, headers } from 'next/headers';
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
		const { id, role, email, emailVerified } = databaseUserAttributes;
		return {
			id,
			role,
			email,
			emailVerified,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: Pick<
			InferSelectModel<typeof users>,
			'id' | 'email' | 'emailVerified' | 'role'
		>;
	}
}

export const validate = cache(async () => {
	'use server';
	const cookiesSessionId = cookies().get(auth.sessionCookieName)?.value ?? null;
	const sessionId = cookiesSessionId ?? auth.readBearerToken(headers().get('Authorization') ?? '');
	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}
	const result = await auth.validateSession(sessionId);
	try {
		if (cookiesSessionId) {
			if (result.session && result.session.fresh) {
				const sessionCookie = auth.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = auth.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
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
	// if (!validated.user.emailVerified) {
	// 	return redirect('/verify-email', RedirectType.push);
	// }
	if (!isAllowed(validated.user, key)) {
		throw new Error(message ?? m.insufficient_permissions());
	}
	return validated;
});

export const authorizeRequest = cache(async (key?: PermissionKey, message?: string) => {
	'use server';
	const validated = await validate();
	if (!validated.user) {
		throw new Response('No valid authorization found.', { status: 401 });
	}
	// if (!validated.user.emailVerified) {
	// 	throw new Response('Account initialization is incomplete, please verify your email.');
	// }
	if (!isAllowed(validated.user, key)) {
		throw new Response(
			message ?? 'Your authorization has insufficient permissions for this request.',
			{ status: 403 }
		);
	}
	return validated;
});
