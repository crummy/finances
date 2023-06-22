import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

interface TransactionTable {
	id: Generated<number>;
	akahuId: string;
	description: string;
	type: string;
	category: string | null;
	date: string;
	amountCents: number;
}

export interface Database {
	transactions: TransactionTable;
}

export type Transaction = Selectable<TransactionTable>;
export type NewTransaction = Insertable<TransactionTable>;
export type EditedTransaction = Updateable<TransactionTable>;
