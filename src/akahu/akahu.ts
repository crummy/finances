import { AkahuClient } from 'akahu';

const appToken = import.meta.env.VITE_AKAHU_APP_TOKEN;
const userToken = import.meta.env.VITE_AKAHU_USER_TOKEN;

const akahu = new AkahuClient({ appToken });

export function getTransactions() {
	return akahu.transactions.list(userToken);
}

export function getAccounts() {
	return akahu.accounts.list(userToken);
}
