import { loadAccounts, loadTransactions } from '../akahu/akahu';
import type { PageServerLoad } from './$types';
import type { Account, Transaction, TransactionQueryParams } from 'akahu';
import { subDays } from 'date-fns';
import { db } from '../db/db.server';
import type { Transaction as DbTransaction } from '../db/types';

type Params = {
	transactions: DbTransaction[];
	accounts: Account[];
};

async function loadLatest() {
	const now = new Date();
	const query: TransactionQueryParams = {
		start: subDays(now, 365).toISOString(),
		end: now.toISOString()
	};

	const transactions: Transaction[] = [];
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
			for (const transaction of transactions) {
				if (existingAkahuIds.includes(transaction._id)) {
					continue;
				}
				await db
					.insertInto('transactions')
					.values({
						akahuId: transaction._id,
						date: transaction.date,
						description: transaction.description,
						type: transaction.type,
						category: 'category' in transaction ? transaction.category.name : null,
						amountCents: Math.round(transaction.amount * 100)
					})
					.execute();
			}
		}

		transactions.push(...page.items);
		// Update the cursor to point to the next page
		query.cursor = page.cursor.next;
		// Continue until the server returns a null cursor
	} while (query.cursor !== null);
}

export const load: PageServerLoad<Params> = async () => {
	await loadLatest();
	const transactions: DbTransaction[] = await db
		.selectFrom('transactions')
		.orderBy('date', 'desc')
		.selectAll()
		.execute();
	const accounts = await loadAccounts();
	return {
		transactions,
		accounts
	};
};
