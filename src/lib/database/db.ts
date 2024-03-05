import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
	host: process.env.DB_HOST_POOLED,
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
