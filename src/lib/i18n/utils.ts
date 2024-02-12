import { Regconfig } from '@/lib/database/constants';
import { headers } from 'next/headers';
import { REGCONFIG_HEADER_NAME } from './constants';
import { AvailableLanguageTag, availableLanguageTags, languageTag } from './generated/runtime';

/**
 * Get a request's regconfig.
 */
export function regconfig() {
	return headers().get(REGCONFIG_HEADER_NAME) as Regconfig;
}

/**
 * Prepend lang param to a unlocalized href. Defaults to using the current language tag if no lang
 * param is provided.
 */
export function withLang<H extends string, L extends AvailableLanguageTag>(href: H, lang?: L) {
	return `/${lang ?? (languageTag() as L extends undefined ? AvailableLanguageTag : L)}${href}` as const;
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
