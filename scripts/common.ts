import { config } from 'dotenv';
import { drizzle as pgDrizzle } from 'drizzle-orm/postgres-js';
import pg from 'postgres';

config({ path: '.env' });

const scriptClient = pg({
	max: 1,
	ssl: 'require',
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: +process.env.DB_PORT,
});

/**
 * Db client to use for running migration and seed scripts.
 */
export const scriptDb = pgDrizzle(scriptClient);

export type ScriptDb = typeof scriptDb;
