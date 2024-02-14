import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LANG_HEADER_NAME } from './constants';
import { isAvailableLanguageTag, sourceLanguageTag } from './generated/runtime';

function middleware(request: NextRequest) {
	const param = request.nextUrl.pathname.split('/')[1];
	const lang = isAvailableLanguageTag(param) ? param : sourceLanguageTag;
	// See next.config.rewrites instead.
	// if (!isAvailableLanguageTag(maybeLang)) {
	// 	request.nextUrl.pathname = `/${sourceLanguageTag}${request.nextUrl.pathname}`;
	// 	return NextResponse.redirect(request.nextUrl);
	// }
	const headers = new Headers(request.headers);
	headers.set(LANG_HEADER_NAME, lang);
	// headers.set(REGCONFIG_HEADER_NAME, REGCONFIGS[lang]);
	return NextResponse.next({
		request: {
			headers,
		},
	});
}

export default middleware;
