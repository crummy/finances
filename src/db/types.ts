import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

interface TransactionTable {
	id: Generated<number>;
	akahuId: string;
	description: string;
	type: string;
	category: string | null;
	date: string;
	amountCents: number;
	akahuAccountId: string;
}

export interface Database {
	transactions: TransactionTable;
	accounts: AccountTable;
}

export type Transaction = Selectable<TransactionTable>;
export type NewTransaction = Insertable<TransactionTable>;
export type EditedTransaction = Updateable<TransactionTable>;

interface AccountTable {
	id: Generated<number>;
	akahuId: string;
	name: string;
	active: number;
	accountNumber: string;
	type: string;
}

export type Account = Selectable<AccountTable>;
