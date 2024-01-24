import { AvailableLanguageTag, isAvailableLanguageTag } from '@translations/runtime';
import { customType } from 'drizzle-orm/pg-core';
import { ValueOf } from 'next/dist/shared/lib/constants';
import { InferColumnType } from './utils';

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

export type AnyLangColumn = InferColumnType<typeof lang>;
