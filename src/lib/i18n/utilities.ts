import type { Url } from 'next/dist/shared/lib/router/router';
import type { Writable } from 'type-fest';
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
