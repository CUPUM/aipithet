import type { AvailableLanguageTag } from '@translations/runtime';
import { isAvailableLanguageTag, setLanguageTag, sourceLanguageTag } from '@translations/runtime';
import { revalidatePath as nextRevalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import type { RedirectType } from 'next/navigation';
import {
	permanentRedirect as nextPermanentRedirect,
	redirect as nextRedirect,
} from 'next/navigation';
import { LANG_HEADER_NAME } from './constants';
import { withLang } from './utilities';

function getPreferredLang<H extends Headers>(headers: H) {
	const preference = headers.get('Accept-Language');
	const matched = preference
		?.split(/;|,/)
		.find((part) => {
			if (part.startsWith('q')) {
				return false;
			}
			const trimmed = part.trim();
			if (!trimmed || trimmed === '*') {
				return false;
			}
			return isAvailableLanguageTag(trimmed);
		})
		?.trim();
	return matched as AvailableLanguageTag | undefined;
}

/**
 * Typed header getter to use in replacement of `languageTag()` on the server as there currently is
 * no way to consistently use `setLanguageTag` to then ge tthe right lang through `languageTag()`
 * across server components, server actions, and route handlers.
 *
 * @see https://github.com/opral/monorepo/blob/da66ac786e0219e90ee1f48d5e7748bb56ad2c9e/inlang/source-code/paraglide/paraglide-js-adapter-next/src/app/getLanguage.server.ts#L9
 */
export function languageTagServer(requestHeaders?: Headers) {
	const _headers = requestHeaders ?? headers();
	const headerLang = _headers.get(LANG_HEADER_NAME);
	if (isAvailableLanguageTag(headerLang)) {
		return headerLang;
	}
	return getPreferredLang(_headers) ?? sourceLanguageTag;
}

/**
 * Use this redirect helper to ensure proper localization. Until next un-becomes stupid and adds a
 * respectable way to detect redirect responses from middlewares...
 *
 * @see https://github.com/vercel/next.js/issues/58281
 */
export function redirect(url: string, type?: RedirectType) {
	setLanguageTag(languageTagServer);
	return nextRedirect(withLang(url), type);
}

/**
 * Use this redirect helper to ensure proper localization. Until next un-becomes stupid and adds a
 * respectable way to detect redirect responses from middlewares...
 *
 * @see https://github.com/vercel/next.js/issues/58281
 */
export function permanentRedirect(url: string, type?: RedirectType) {
	setLanguageTag(languageTagServer);
	return nextPermanentRedirect(withLang(url), type);
}

export function revalidatePath(originalPath: string, type?: 'layout' | 'page') {
	setLanguageTag(languageTagServer);
	return nextRevalidatePath(withLang(originalPath), type);
}
