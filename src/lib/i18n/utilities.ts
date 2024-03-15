import type { Url } from 'next/dist/shared/lib/router/router';
import type { RedirectType } from 'next/navigation';
import {
	permanentRedirect as nextPermanentRedirect,
	redirect as nextRedirect,
} from 'next/navigation';
import type { Writable } from 'type-fest';
import { LANG_HEADER_NAME } from './constants';
import type { AvailableLanguageTag } from './generated/runtime';
import { availableLanguageTags, isAvailableLanguageTag, languageTag } from './generated/runtime';

type StringWithLang<
	H extends string,
	L extends AvailableLanguageTag,
> = `/${L extends undefined ? AvailableLanguageTag : L}${H}`;

export function getPathnameLang<U extends string>(url: `/${AvailableLanguageTag}${U}` | U) {
	const [_, maybeLang] = url.split('/');
	if (isAvailableLanguageTag(maybeLang)) {
		return maybeLang;
	}
}

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

export function getHeadersLang<H extends Headers>(headers: H) {
	const header = headers.get(LANG_HEADER_NAME);
	if (isAvailableLanguageTag(header)) {
		return header;
	}
	return getPreferredLang(headers);
}

/**
 * Prepend lang param to an href. If the given href already comprises a lang param, it will be
 * removed and recomputed accordingly. Defaults to using the current language tag if no lang param
 * is provided.
 */
export function withLang<
	const U extends Url,
	L extends AvailableLanguageTag,
	R = U extends string
		? StringWithLang<U, L>
		: Writable<{
				[K in keyof U]: K extends 'pathname' | 'href'
					? U[K] extends string
						? StringWithLang<U[K], L>
						: U[K]
					: never;
			}>,
>(url: U, lang?: L): R {
	if (typeof url === 'string') {
		// return `/${lang ?? (languageTag() as L extends undefined ? AvailableLanguageTag : L)}${href}` as const;
		return `/${lang ?? languageTag()}${removeLang(url)}` as R;
	}
	if (url.href) {
		url.href = withLang(removeLang(url.href), lang);
	}
	if (url.pathname) {
		url.pathname = withLang(removeLang(url.pathname), lang);
	}
	return url as unknown as R;
}

/**
 * Remove an app-oriented href's lang param.
 */
export function removeLang<U extends string>(url: `/${AvailableLanguageTag}${U}` | U) {
	const [_, maybeLang, ...rest] = url.split('/');
	if (availableLanguageTags.includes(maybeLang as AvailableLanguageTag)) {
		return `/${rest.join('/')}` as U;
	}
	return url as U;
}

/**
 * Use this redirect helper to ensure proper localization. Until next un-becomes stupid and adds a
 * respectable way to detect redirect responses from middlewares...
 *
 * @see https://github.com/vercel/next.js/issues/58281
 */
export function redirect(url: string, type?: RedirectType) {
	return nextRedirect(withLang(url), type);
}

/**
 * Use this redirect helper to ensure proper localization. Until next un-becomes stupid and adds a
 * respectable way to detect redirect responses from middlewares...
 *
 * @see https://github.com/vercel/next.js/issues/58281
 */
export function permanentRedirect(url: string, type?: RedirectType) {
	return nextPermanentRedirect(withLang(url), type);
}
