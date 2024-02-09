import { exit } from 'process';

try {
	console.info('🥕 Seeding database...');
	// Seed
	console.info('🚀 Database seeded successfully!');
} catch (error) {
	console.error('❌ Database seeding failed (see error below).');
	console.error(error);
} finally {
	exit();
}
