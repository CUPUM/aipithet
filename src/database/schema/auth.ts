import { boolean, pgSchema, text, timestamp } from 'drizzle-orm/pg-core';
import { ROLE_DEFAULT, role } from '../custom-types';
import { generateNanoid } from '../utils';

export const authSchema = pgSchema('auth');

export const roles = authSchema.table('roles', {
	role: role('role').primaryKey(),
});

export const users = authSchema.table('users', {
	id: text('id')
		.default(generateNanoid({ length: 15 }))
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
});
