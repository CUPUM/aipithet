import { boolean, pgSchema, primaryKey, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { LANG_COLUMN_NAME, ROLE_DEFAULT, USER_ID_LENGTH } from '../constants';
import { role } from '../custom-types';
import { generateNanoid, langColumn } from '../utils';

export const authSchema = pgSchema('auth');

export const roles = authSchema.table('roles', {
	role: role('role').primaryKey(),
});

export const rolesTranslations = authSchema.table(
	'user_roles_t',
	{
		...langColumn,
		role: role('role')
			.notNull()
			.references(() => roles.role, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		name: text('title'),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.role, table.lang] }),
			unq: unique().on(table[LANG_COLUMN_NAME], table.name),
		};
	}
);

export const users = authSchema.table('users', {
	id: text('id')
		.default(generateNanoid({ size: USER_ID_LENGTH }))
		.primaryKey(),
	role: role('role')
		.references(() => roles.role, {
			onUpdate: 'cascade',
			onDelete: 'set default',
		})
		.default(ROLE_DEFAULT)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	email: text('email').unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	hashedPassword: text('hashed_password'),
});

export const sessions = authSchema.table('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	expiresAt: timestamp('exipires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export const emailConfirmationCodes = authSchema.table('email_confirmation_codes', {});
