import { cookies } from 'next/headers';
import { RedirectType, notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { auth } from './auth';
import type { Role } from './constants';
import { ROLES } from './constants';

/**
 * CRUD operations.
 */
type Operation = 'create' | 'read' | 'update' | 'delete';

/**
 * RBAC permissions dict.
 */
const PERMISSIONS = {
	'surveys.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
} as const satisfies Record<`${string}.${Operation}`, Role[]>;

type PermissionKey = keyof typeof PERMISSIONS;

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
 */
export const authorize = cache(async (key?: PermissionKey) => {
	const { user, session } = await validate();
	if (!user) {
		redirect('/signin', RedirectType.push);
	}
	if (key && !(PERMISSIONS[key] as Role[]).includes(user.role as Role)) {
		notFound();
	}
	return {
		user,
		session,
	};
});
