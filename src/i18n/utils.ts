import { Regconfig } from '@/database/constants';
import { headers } from 'next/headers';
import { createContext } from 'react';
import { REGCONFIG_HEADER_NAME } from './constants';
import { languageTag } from './generated/runtime';

export const LangContext = createContext(languageTag());

/**
 * Get a request's regconfig.
 */
export function regconfig() {
	return headers().get(REGCONFIG_HEADER_NAME) as Regconfig;
}

export function useHref(href: string) {
	// const lang = useLanguageTag
	// return `/${router.}${href}`;
}

export function removeLang(href: string) {}
