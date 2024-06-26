import { ROLE_DEFAULT } from '@lib/auth/constants';
import { add } from 'drizzle-orm-helpers';
import { nanoid, now, toInterval } from 'drizzle-orm-helpers/pg';
import { boolean, pgSchema, primaryKey, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { EMAIL_CONFIRMATION_CODE_LENGTH, LANG_COLUMN_NAME, USER_ID_LENGTH } from '../constants';
import { role } from '../custom-types';
import { LANG_COLUMN } from './i18n';

export const authSchema = pgSchema('auth');

export const roles = authSchema.table('roles', {
	role: role('role').primaryKey(),
});

export const rolesTranslations = authSchema.table(
	'user_roles_t',
	{
		...LANG_COLUMN,
		role: role('role')
			.notNull()
			.references(() => roles.role, { onDelete: 'cascade', onUpdate: 'cascade' }),
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
		.default(nanoid({ size: USER_ID_LENGTH }))
		.primaryKey(),
	role: role('role')
		.references(() => roles.role, { onUpdate: 'cascade', onDelete: 'set default' })
		.default(ROLE_DEFAULT)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	hashedPassword: text('hashed_password').notNull(),
});

export const sessions = authSchema.table('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	expiresAt: timestamp('exipires_at', { withTimezone: true }).notNull(),
});

export const emailVerificationCodes = authSchema.table('email_verification_codes', {
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.primaryKey(),
	code: text('code')
		.default(
			nanoid({
				size: EMAIL_CONFIRMATION_CODE_LENGTH,
				alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			})
		)
		.notNull(),
	email: text('email').notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true })
		.notNull()
		.default(add(now(), toInterval({ hours: 1 })).inlineParams()),
});

export const passwordResetTokens = authSchema.table('password_reset_tokens', {
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.primaryKey(),
	token: text('token')
		.notNull()
		.default(
			nanoid({
				size: 16,
				alphabet:
					'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789^çàèé.,ÉÀÈÙù!@#$%?&*()_+',
			})
		),
	expiresAt: timestamp('expires_at', { withTimezone: true })
		.notNull()
		.default(add(now(), toInterval({ hours: 1 })).inlineParams()),
});

// export const emailInvitations = authSchema.table(
// 	'email_invitations',
// 	{
// 		email: text('email').notNull(),
// 		editor: boolean('editor'),
// 		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
// 		expiresAt: timestamp('expires_at')
// 			.default(add(now(), toInterval({ months: 1 })).inlineParams())
// 			.notNull(),
// 		code: text('code')
// 			.default(nanoid({ size: 8, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }))
// 			.notNull(),
// 		surveyId: text('survey_id').references(() => labelingSurveys.id, {
// 			onDelete: 'cascade',
// 			onUpdate: 'cascade',
// 		}),
// 		imagePoolId: text('image_pool_id').references(() => imagesPools.id, {
// 			onDelete: 'cascade',
// 			onUpdate: 'cascade',
// 		}),
// 	},
// 	(table) => {
// 		return {
// 			unq: unique()
// 				.on(table.editor, table.surveyId, table.imagePoolId, table.email)
// 				.nullsNotDistinct(),
// 		};
// 	}
// );
