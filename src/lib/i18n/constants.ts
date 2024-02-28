import type { AvailableLanguageTag } from './generated/runtime';

export const LANG_HEADER_NAME = 'aipithet-language-tag';

export const REGCONFIG_HEADER_NAME = 'aipithet-regconfig';

export const LANG_NAMES = {
	fr: 'Français',
	en: 'English',
} satisfies Record<AvailableLanguageTag, string>;
