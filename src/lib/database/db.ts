import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as pgDrizzle } from 'drizzle-orm/postgres-js';
import pg from 'postgres';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: +process.env.DB_PORT,
	ssl: true,
});
/**
 * Web-socket pooled database connection.
 *
 * @see https://github.com/neondatabase/serverless#example-nodejs-with-poolconnect
 */
export const db = drizzle(pool);

export type Db = typeof db;

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
