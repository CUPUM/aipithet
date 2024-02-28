import type { ValueOf } from 'type-fest';

export const ROLES = {
	PARTICIPANT: 'participant',
	EDITOR: 'editor',
	SUPER_EDITOR: 'super-editor',
	ADMIN: 'admin',
} as const;
export type Role = ValueOf<typeof ROLES>;

export const ROLES_ARR = Object.values(ROLES);

export const ROLE_DEFAULT = ROLES.PARTICIPANT;
export type RoleDefault = typeof ROLE_DEFAULT;
