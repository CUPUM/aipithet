import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LANG_HEADER_NAME } from './constants';
import { setLanguageTag, sourceLanguageTag } from './generated/runtime';
import { getPathnameLang } from './utilities';
import { getHeadersLang, languageTagServer } from './utilities-server';

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
	const headersLang = getHeadersLang(request.headers);
	const lang = pathnameLang ?? headersLang ?? sourceLanguageTag;
	const responseHeaders = new Headers(request.headers);
	responseHeaders.set(LANG_HEADER_NAME, lang);
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
	return NextResponse.next({ request: { headers: responseHeaders } });
}

export default middleware;
