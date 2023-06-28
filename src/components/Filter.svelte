<script lang="ts">
	import { distinct } from '$lib/util';
	import InlineAutocomplete from '@components/InlineAutocomplete.svelte';
	import type { TransactionAndAccount } from '../routes/+page.server';

	export let transactions: TransactionAndAccount[];

	const categories: string[] = transactions
		.map((transaction) => transaction.category?.toLowerCase())
		.filter((category) => category != null)
		.filter(distinct) as string[];
	const categoryFilter = (category: string) => (t: TransactionAndAccount) => {
		return t.category?.toLowerCase() == category.toLowerCase();
	};
	const categoryShortOptions = Object.fromEntries(
		categories.map((c) => [`c:${c}`, categoryFilter])
	);
	const categoryOptions = Object.fromEntries(
		categories.map((c) => [`category:${c}`, categoryFilter(c)])
	);

	const types: string[] = transactions
		.map((transaction) => transaction.type.toLowerCase())
		.filter(distinct);
	const typeFilter = (type: string) => (t: TransactionAndAccount) => {
		return t.type?.toLowerCase() == type.toLowerCase();
	};
	const typeShortOptions = Object.fromEntries(types.map((t) => [`t:${t}`, typeFilter(t)]));
	const typeOptions = Object.fromEntries(types.map((t) => [`type:${t}`, typeFilter(t)]));

	const descriptions: string[] = transactions
		.map((transaction) => transaction.description.toLowerCase())
		.filter(distinct);
	const descriptionFilter = (description: string) => (t: TransactionAndAccount) => {
		return t.description.toLowerCase().includes(description.toLowerCase());
	};

	const accounts = transactions.map((t) => t.accountName?.toLowerCase()).filter(distinct);
	const accountFilter = (account: string) => (t: TransactionAndAccount) => {
		return t.accountName.toLowerCase() == account.toLowerCase();
	};
	const accountOptions = Object.fromEntries(
		accounts.map((a) => [`account:${a}`, accountFilter(a)])
	);

	const autocompleteOptions: string[] = [
		...Object.keys(categoryShortOptions),
		...Object.keys(categoryOptions),
		...Object.keys(typeShortOptions),
		...Object.keys(typeOptions),
		...descriptions,
		'income',
		'expenses'
	];

	type Filter = (t: TransactionAndAccount) => boolean;
	const filters: Record<string, Filter> = {
		...categoryShortOptions,
		...categoryOptions,
		...typeShortOptions,
		...typeOptions,
		income: (t: TransactionAndAccount) => t.amountCents > 0,
		expenses: (t: TransactionAndAccount) => t.amountCents < 0
	};

	export let filteredTransactions: TransactionAndAccount[];
	$: filteredTransactions = transactions.filter((t) => {
		const matchesFilters =
			filterInputs.length == 0 ||
			filterInputs
				.map(
					(input) => (t: TransactionAndAccount) =>
						filters[input]?.(t) ?? descriptionFilter(input)(t)
				)
				.every((f) => f(t));
		const matchesAccountFilters = accountFilterInputs.includes(
			'account:' + t.accountName.toLowerCase()
		);
		if (filterInputs.length == 0) return matchesAccountFilters;
		return matchesFilters && matchesAccountFilters;
	});

	let filterInputs: string[] = [];
	let accountFilterInputs: string[] = Object.keys(accountOptions).map((i) => i.toLowerCase());
</script>

<InlineAutocomplete
	class={$$restProps.class}
	options={autocompleteOptions.map((o) => o.toLowerCase())}
	permaOptions={Object.keys(accountOptions).map((o) => o.toLowerCase())}
	bind:selected={filterInputs}
	bind:permaSelected={accountFilterInputs}
/>
