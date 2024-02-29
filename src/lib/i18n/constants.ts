import type { AvailableLanguageTag } from './generated/runtime';

export const LANG_HEADER_NAME = 'aipithet-lang';

export const LANG_NAMES = {
	fr: 'Français',
	en: 'English',
} satisfies Record<AvailableLanguageTag, string>;
