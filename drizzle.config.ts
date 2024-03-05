import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./src/lib/database/schema/*'],
	out: './migrations',
	driver: 'pg',
	breakpoints: true,
	dbCredentials: {
		connectionString: process.env.NEON_POOL_DB_URL!,
	},
	introspect: {
		casing: 'camel',
	},
	verbose: true,
	strict: true,
});
