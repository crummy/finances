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
		.execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('transactions').ifExists().execute();
}
