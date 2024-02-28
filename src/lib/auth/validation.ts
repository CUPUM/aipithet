import { ROLES_ARR, type Role } from './constants';

export function isRole(maybeRole: unknown): maybeRole is Role {
	return ROLES_ARR.includes(maybeRole as Role);
}
