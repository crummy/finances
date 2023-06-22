import { AkahuClient } from 'akahu';
import type { TransactionQueryParams } from 'akahu';

const appToken = import.meta.env.VITE_AKAHU_APP_TOKEN;
const userToken = import.meta.env.VITE_AKAHU_USER_TOKEN;

const akahu = new AkahuClient({ appToken });

export function loadTransactions(query: TransactionQueryParams | undefined = undefined) {
	return akahu.transactions.list(userToken, query);
}

export function loadAccounts() {
	return akahu.accounts.list(userToken);
}
