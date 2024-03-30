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
 * RBAC permissions dictionnary for CRUD operations.
 */
export const PERMISSIONS = {
	'surveys.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.update': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.delete': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'labels.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'labels.update': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'labels.delete': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.chapters.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.chapters.update': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.chapters.delete': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.invitations.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'surveys.invitations.delete': [],
	'images.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR, ROLES.PARTICIPANT],
	'images.update': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR, ROLES.PARTICIPANT],
	'images.delete': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR, ROLES.PARTICIPANT],
	'images.pools.create': [ROLES.ADMIN, ROLES.SUPER_EDITOR],
	'images.pools.update': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
	'images.pools.delete': [ROLES.ADMIN, ROLES.SUPER_EDITOR, ROLES.EDITOR],
} as const satisfies Record<`${string}.${Operation}`, Role[]>;

export type PermissionKey = keyof typeof PERMISSIONS;

export const USER_PASSWORD_MIN = 8;
