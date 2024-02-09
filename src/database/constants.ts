import { AvailableLanguageTag } from '@/i18n/generated/runtime';
import { ValueOf } from 'next/dist/shared/lib/constants';

export const REGCONFIGS = {
	fr: 'french',
	en: 'english',
} as const satisfies Record<AvailableLanguageTag, string>;

export type Regconfig = ValueOf<typeof REGCONFIGS>;

export const NANOID_DEFAULT_LENGTH = 21;

export const USER_ID_LENGTH = 15;

export const LANG_COLUMN_NAME = 'lang';

export type LangColumnName = typeof LANG_COLUMN_NAME;

export const ROLES = {
	PARTICIPANT: 'participant',
	EDITOR: 'editor',
	SUPER_EDITOR: 'super-editor',
	ADMIN: 'admin',
} as const;

export type Role = ValueOf<typeof ROLES>;

export const ROLES_ARR = Object.values(ROLES);

export const ROLE_DEFAULT = ROLES.PARTICIPANT;

export function isRole(maybeRole: unknown): maybeRole is Role {
	return ROLES_ARR.includes(maybeRole as Role);
}
