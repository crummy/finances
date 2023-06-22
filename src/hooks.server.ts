import { runMigrations } from './db/migrations.server';

runMigrations().then(() => console.log('DB migrations complete'));
