import type { Role } from '@lib/auth/constants';
import { ROLE_DEFAULT } from '@lib/auth/constants';
import { isRole } from '@lib/auth/utilities';
import type { AvailableLanguageTag } from '@translations/runtime';
import { isAvailableLanguageTag } from '@translations/runtime';
import { customType } from 'drizzle-orm/pg-core';

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

/**
 * AvailableLanguageTag code custom type.
 *
 * @see {@link AvailableLanguageTag}
 */
export const lang = customType<{ data: AvailableLanguageTag; driverData: string }>({
	dataType() {
		return 'text';
	},
	fromDriver(value) {
		if (isAvailableLanguageTag(value)) {
			return value;
		}
		throw new Error(`Value returned by database driver (${value}) is not a valid lang`);
	},
	toDriver(value) {
		if (isAvailableLanguageTag(value)) {
			return value;
		}
		throw new Error(`Tried to input wrong value for AvailableLanguageTag (${value}).`);
	},
});
