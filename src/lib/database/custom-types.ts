import { customType } from 'drizzle-orm/pg-core';
import { ROLE_DEFAULT, Role, isRole } from './constants';

/**
 * Implementing our own db-level role type in sync with UserRole in lieu of using a pgEnum to avoid
 * complications regarding updatability and simplify values listing.
 */
export const role = customType<{ data: Role }>({
	dataType() {
		return 'text';
	},
	fromDriver(value) {
		if (isRole(value)) {
			return value;
		}
		// Fallback to lowest role in case of mismatch.
		return ROLE_DEFAULT;
	},
	toDriver(value) {
		return value;
	},
});
