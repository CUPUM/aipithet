import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LANG_HEADER_NAME } from './constants';
import { isAvailableLanguageTag, sourceLanguageTag } from './generated/runtime';
import { getUrlLang } from './utilities';

function middleware(request: NextRequest) {
	const paramLang = request.nextUrl.pathname.split('/')[1];
	const headerLang = request.headers.get(LANG_HEADER_NAME);
	const lang = isAvailableLanguageTag(paramLang)
		? paramLang
		: isAvailableLanguageTag(headerLang)
			? headerLang
			: sourceLanguageTag;
	const headers = new Headers(request.headers);
	headers.set(LANG_HEADER_NAME, lang);
	const response = NextResponse.next({ request: { headers } });
	const redirectUrl = response.headers.get('x-middleware-request-x-action-redirect');
	if (redirectUrl) {
		const redirectLang = getUrlLang(redirectUrl);
		if (!redirectLang) {
			// const redirectUrlWithLang = withLang(redirectUrl, lang);
			// Figure out how to redirect properly
		}
	}
	return response;
}

export default middleware;
