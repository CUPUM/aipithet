'use client';

import type { AvailableLanguageTag } from '@lib/i18n/generated/runtime';
import {
	isAvailableLanguageTag,
	setLanguageTag,
	sourceLanguageTag,
} from '@lib/i18n/generated/runtime';

setLanguageTag(() => {
	const documentLang = document.documentElement.lang;
	return isAvailableLanguageTag(documentLang) ? documentLang : sourceLanguageTag;
});

export function ClientLanguageProvider(props: { language: AvailableLanguageTag }) {
	setLanguageTag(props.language);
	return undefined;
	// return <LangContext.Provider value={props.language}>{children}</LangContext.Provider>;
}
