import { Migrator } from 'kysely';
import { db } from './db.server';
import * as migration1 from './migrations/2023-06-22-initial';

export async function runMigrations() {
	const migrator = new Migrator({
		db,
		// Normally use FileMigrationProvider here but it doesn't worth with SvelteKit's config: ERR_UNKNOWN_FILE_EXTENSION
		provider: {
			getMigrations() {
				return Promise.resolve({ '2023-06-22-initial': migration1 });
			}
		}
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === 'Error') {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error('failed to migrate');
		console.error(error);
		process.exit(1);
	}
}
