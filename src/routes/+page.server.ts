import { loadAccounts, loadTransactions } from '../akahu/akahu';
import type { PageServerLoad } from './$types';
import type { TransactionQueryParams } from 'akahu';
import { subDays } from 'date-fns';
import { db } from '../db/db.server';

export interface TransactionAndAccount {
	akahuId: string;
	description: string;
	type: string;
	category: string | null;
	date: string;
	amountCents: number;
	accountName: string;
}

type Params = {
	transactions: TransactionAndAccount[];
};

async function loadLatestTransactions() {
	const now = new Date();
	const query: TransactionQueryParams = {
		start: subDays(now, 365 * 2).toISOString(), // akahu supports querying up to 2 years of transactions
		end: now.toISOString()
	};

	do {
		// Transactions are returned one page at a time
		const page = await loadTransactions(query);
		// Store the returned transaction `items` from each page
		const existingTransactions = await db
			.selectFrom('transactions')
			.where(
				'akahuId',
				'in',
				page.items.map((t) => t._id)
			)
			.selectAll()
			.execute();

		if (existingTransactions.length == page.items.length) {
			// no new transactions. don't look any further into the past; assume we've already loaded everything
			return;
		} else {
			const existingAkahuIds = existingTransactions.map((t) => t.akahuId);
			const newTransactions = page.items.filter((t) => !existingAkahuIds.includes(t._id));
			for (const transaction of newTransactions) {
				await db
					.insertInto('transactions')
					.values({
						akahuId: transaction._id,
						date: transaction.date,
						description: transaction.description,
						type: transaction.type,
						category: 'category' in transaction ? transaction.category.name : null,
						amountCents: Math.round(transaction.amount * 100),
						akahuAccountId: transaction._account
					})
					.execute();
			}
			console.log('Added ' + newTransactions.length + ' new transactions');
		}

		// Update the cursor to point to the next page
		query.cursor = page.cursor.next;
		// Continue until the server returns a null cursor
	} while (query.cursor !== null);
}

async function loadLatestAccounts() {
	const accounts = await loadAccounts();
	// for every account,
	for (const account of accounts) {
		const existingRecord = await db
			.selectFrom('accounts')
			.select('id')
			.where('akahuId', '=', account._id)
			.executeTakeFirst();
		if (existingRecord) {
			// update the existing record with latest info
			await db
				.updateTable('accounts')
				.set({
					name: account.name,
					accountNumber: account.formatted_account,
					type: account.type,
					active: account.status == 'ACTIVE' ? 1 : 0
				})
				.where('akahuId', '=', account._id)
				.execute();
		} else {
			// otherwise create a new one
			await db
				.insertInto('accounts')
				.values({
					akahuId: account._id,
					name: account.name,
					accountNumber: account.formatted_account,
					type: account.type,
					active: account.status == 'ACTIVE' ? 1 : 0
				})
				.execute();
		}
	}
}

export const load: PageServerLoad<Params> = async () => {
	await loadLatestAccounts();
	await loadLatestTransactions();
	const transactions: TransactionAndAccount[] = await db
		.selectFrom('transactions')
		.innerJoin('accounts', 'transactions.akahuAccountId', 'accounts.akahuId')
		.select([
			'transactions.akahuId',
			'description',
			'transactions.type',
			'category',
			'date',
			'amountCents',
			'accounts.name as accountName'
		])
		.orderBy((eb) => eb.ref('date'), 'desc')
		.execute();
	return {
		transactions
	};
};
