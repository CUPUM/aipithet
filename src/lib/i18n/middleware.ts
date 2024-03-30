import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LANG_HEADER_NAME } from './constants';
import { setLanguageTag } from './generated/runtime';
import { getPathnameLang, withLang } from './utilities';
import { languageTagServer } from './utilities-server';

/**
 * @see https://github.com/vercel/next.js/issues/58281
 * and
 * @see https://github.com/vercel/next.js/issues/59217
 *
 * to witness how dumb next's handling of redirects is. Until this behavior is improved,
 * we must provide our own next/navigation wrappers to facilitate localization of redirects.
 */
function middleware(request: NextRequest) {
	const pathnameLang = getPathnameLang(request.nextUrl.pathname);
	const headersLang = languageTagServer();
	const headers = new Headers(request.headers);
	headers.set(LANG_HEADER_NAME, pathnameLang ?? headersLang);
	setLanguageTag(languageTagServer);
	// if (!pathnameLang && headersLang) {
	// 	// headers = new Headers();
	// 	// headers.set(LANG_HEADER_NAME, lang);
	// 	const redirect = request.headers.get('x-action-redirect');
	// 	if (redirect) {
	// 		const langRedirect = withLang(redirect, lang);
	// 		const res = NextResponse.redirect(new URL(langRedirect, request.nextUrl.origin), {
	// 			headers,
	// 			status: 303,
	// 		});
	// 		console.log(res);
	// 		return res;
	// 	}
	// }
	if (!pathnameLang) {
		return NextResponse.rewrite(
			new URL(withLang(request.url.replace(request.nextUrl.origin, '')), request.nextUrl.origin),
			{ request: { headers } }
		);
	}
	return NextResponse.next({ request: { headers } });
}

export default middleware;
