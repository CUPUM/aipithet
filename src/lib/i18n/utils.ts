import { Regconfig } from '@/lib/database/constants';
import { headers } from 'next/headers';
import { useMemo } from 'react';
import { REGCONFIG_HEADER_NAME } from './constants';

/**
 * Get a request's regconfig.
 */
export function regconfig() {
	return headers().get(REGCONFIG_HEADER_NAME) as Regconfig;
}

export function useLangHref(href: string) {
	const [langHref, setLangHref] = useMemo();
	// const lang = useLanguageTag
	// return `/${router.}${href}`;
}

export function removeLang(href: string) {}
