<script lang="ts">
	import { distinct } from '$lib/util';
	import InlineAutocomplete from '@components/InlineAutocomplete.svelte';
	import type { TransactionAndAccount } from '../routes/+page.server';

	export let transactions: TransactionAndAccount[];

	const categories: string[] = transactions
		.map((transaction) => transaction.category)
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

	const types: string[] = transactions.map((transaction) => transaction.type).filter(distinct);
	const typeFilter = (type: string) => (t: TransactionAndAccount) => {
		return t.type?.toLowerCase() == type.toLowerCase();
	};
	const typeShortOptions = Object.fromEntries(types.map((t) => [`t:${t}`, typeFilter(t)]));
	const typeOptions = Object.fromEntries(types.map((t) => [`type:${t}`, typeFilter(t)]));

	const descriptions: string[] = transactions
		.map((transaction) => transaction.description)
		.filter(distinct);
	const descriptionFilter = (description: string) => (t: TransactionAndAccount) => {
		return t.description.toLowerCase().includes(description.toLowerCase());
	};

	const accounts = transactions.map((t) => t.accountName).filter(distinct);

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
		if (filterInputs.length == 0) return true;
		return filterInputs
			.map(
				(input) => (t: TransactionAndAccount) => filters[input]?.(t) ?? descriptionFilter(input)(t)
			)
			.every((f) => f(t));
	});

	let filterInputs: string[] = [];

	$: {
		console.log(filterInputs);
	}
</script>

<InlineAutocomplete
	class={$$restProps.class}
	options={autocompleteOptions}
	permaOptions={accounts}
	bind:selected={filterInputs}
/>
