import i18nMiddleware from '@lib/i18n/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	return i18nMiddleware(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
};
