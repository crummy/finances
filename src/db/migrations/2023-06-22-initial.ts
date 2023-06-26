import type { Kysely } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('transactions')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('akahu_id', 'text', (col) => col.unique())
		.addColumn('description', 'text', (col) => col.notNull())
		.addColumn('type', 'text', (col) => col.notNull())
		.addColumn('amount_cents', 'integer', (col) => col.notNull())
		.addColumn('date', 'text', (col) => col.notNull())
		.addColumn('category', 'text')
		.addColumn('akahu_account_id', 'text', (col) => col.references('accounts.akahu_id').notNull())
		.execute();

	await db.schema
		.createTable('accounts')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('akahu_id', 'text', (col) => col.unique())
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('active', 'numeric', (col) => col.notNull())
		.addColumn('account_number', 'text', (col) => col.notNull())
		.addColumn('type', 'text', (col) => col.notNull())
		.execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('transactions').ifExists().execute();
	await db.schema.dropTable('accounts').ifExists().execute();
}
