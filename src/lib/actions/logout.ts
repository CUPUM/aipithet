'use server';

import { auth, validate } from '@lib/auth/auth';
import { redirect } from '@lib/i18n/utilities';
import { cookies } from 'next/headers';

export default async function logout() {
	const { session } = await validate();
	if (!session) {
		throw new Error('Unauthorized');
	}
	await auth.invalidateSession(session.id);
	const sessionCookie = auth.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect('/');
}
