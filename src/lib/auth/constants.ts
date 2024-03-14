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

/**
 * CRUD operations.
 */
type Operation = 'create' | 'read' | 'update' | 'delete';

/**
 * RBAC permissions dict.
 */
export const PERMISSIONS = {
	'surveys.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.invite.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
} as const satisfies Record<`${string}.${Operation}`, Role[]>;

export type PermissionKey = keyof typeof PERMISSIONS;

export const USER_PASSWORD_MIN = 8;
