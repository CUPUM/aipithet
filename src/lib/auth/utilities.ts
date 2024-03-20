import type { User } from 'lucia';
import type { PermissionKey, Role } from './constants';
import { PERMISSIONS, ROLES_ARR } from './constants';

export function isRole(maybeRole: unknown): maybeRole is Role {
	return ROLES_ARR.includes(maybeRole as Role);
}

export function isAllowed(user: User, key?: PermissionKey) {
	return !key || (PERMISSIONS[key] as Role[]).includes(user.role);
}
