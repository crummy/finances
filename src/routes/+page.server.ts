import { getAccounts, getTransactions } from '../akahu/akahu';
import type { PageServerLoad } from './$types';
import type { Account, Paginated, Transaction } from 'akahu';

type Params = {
	transactions: Paginated<Transaction>;
	accounts: Account[];
};

export const load: PageServerLoad<Params> = async () => {
	return {
		transactions: await getTransactions(),
		accounts: await getAccounts()
	};
};
