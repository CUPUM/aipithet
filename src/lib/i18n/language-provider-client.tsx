'use client';
import type { AvailableLanguageTag } from '@lib/i18n/generated/runtime';
import { setLanguageTag } from '@lib/i18n/generated/runtime';

// export const LangContext = createContext(languageTag());

// export function useLang() {
// 	const ctx = useContext(LangContext);
// 	if (!ctx) {
// 		throw new Error(
// 			"Missing the client-side language context provider. Please make sure to add it in the app's root layout."
// 		);
// 	}
// 	return ctx;
// }

export function ClientLanguageProvider(props: { language: AvailableLanguageTag }) {
	setLanguageTag(props.language);
	return null;
	// return <LangContext.Provider value={props.language}>{children}</LangContext.Provider>;
}
