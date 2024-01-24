import { pgSchema } from 'drizzle-orm/pg-core';

export const authSchema = pgSchema('auth');

export const roles = authSchema.table('roles', {
	// key:
});

export const users = authSchema.table('users', {});
