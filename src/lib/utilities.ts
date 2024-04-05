import type { AvailableLanguageTag } from '@translations/runtime';
import { withLang } from './i18n/utilities';

export function appUrl(
	relativePath: string,
	{ lang = true }: { lang?: boolean | AvailableLanguageTag } = {}
) {
	const relativeLangPath = lang
		? withLang(relativePath, lang === true ? undefined : lang)
		: relativePath;
	const base = process.env.VERCEL_URL ?? `http://localhost:${process.env.PORT}`;
	return `${base}${relativeLangPath}`;
}
