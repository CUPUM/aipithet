'use server';

import { auth, validate } from '@lib/auth/auth';
import { languageTagServer, redirect } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { cookies } from 'next/headers';

export default async function logout() {
	setLanguageTag(languageTagServer);
	const { session } = await validate();
	if (!session) {
		throw new Error('Unauthorized');
	}
	await auth.invalidateSession(session.id);
	const sessionCookie = auth.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect('/');
}
