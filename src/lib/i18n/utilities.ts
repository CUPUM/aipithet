import type { Url } from 'next/dist/shared/lib/router/router';
import type { Writable } from 'type-fest';
import type { AvailableLanguageTag } from './generated/runtime';
import { availableLanguageTags, languageTag } from './generated/runtime';

type StringWithLang<
	H extends string,
	L extends AvailableLanguageTag,
> = `/${L extends undefined ? AvailableLanguageTag : L}${H}`;

/**
 * Prepend lang param to an href. If the given href already comprises a lang param, it will be
 * removed and recomputed accordingly. Defaults to using the current language tag if no lang param
 * is provided.
 */
export function withLang<
	const H extends Url,
	L extends AvailableLanguageTag,
	R = H extends string
		? StringWithLang<H, L>
		: Writable<{
				[K in keyof H]: K extends 'pathname' | 'href'
					? H[K] extends string
						? StringWithLang<H[K], L>
						: H[K]
					: never;
			}>,
>(href: H, lang?: L): R {
	if (typeof href === 'string') {
		// return `/${lang ?? (languageTag() as L extends undefined ? AvailableLanguageTag : L)}${href}` as const;
		return `/${lang ?? languageTag()}${removeLang(href)}` as R;
	}
	if (href.href) {
		href.href = withLang(removeLang(href.href), lang);
	}
	if (href.pathname) {
		href.pathname = withLang(removeLang(href.pathname), lang);
	}
	return href as unknown as R;
}

/**
 * Remove an app-oriented href's lang param.
 */
export function removeLang<H extends string>(href: `/${AvailableLanguageTag}${H}` | H) {
	const [_, maybeLang, ...rest] = href.split('/');
	if (availableLanguageTags.includes(maybeLang as AvailableLanguageTag)) {
		return `/${rest.join('/')}` as H;
	}
	return href as H;
}
