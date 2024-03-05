// This should soon be a part of drizzle-kit
// i.e.: it will be deprecated when `drizzle-kit apply` becomes a thing.

import { scriptDb } from '@lib/database/db';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { exit } from 'process';

try {
	console.info('🚧 Applying database migration(s)...');
	await migrate(scriptDb, { migrationsFolder: './migrations' });
	console.info('🚀 Database migration(s) applied successfully!');
} catch (error) {
	console.error('❌ Database migration(s) failed (see error below).');
	console.error(error);
} finally {
	exit();
}
