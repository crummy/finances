<script lang="ts">
	import type { Transaction } from '../db/types';
	import { distinct } from '$lib/util';
	import InlineAutocomplete from '@components/InlineAutocomplete.svelte';

	export let transactions: Transaction[];

	const categories: string[] = transactions
		.map((transaction) => transaction.category)
		.filter((category) => category != null)
		.filter(distinct);
	const types: string[] = transactions.map((transaction) => transaction.type).filter(distinct);
	const descriptions: string[] = transactions
		.map((transaction) => transaction.description)
		.filter(distinct);
	const autocompleteOptions = [
		...categories.map((c) => `c:${c}`),
		...categories.map((c) => `category:${c}`),
		...types.map((t) => `t:${t}`),
		...types.map((t) => `type:${t}`),
		...descriptions.map((d) => `d:${d}`),
		...descriptions.map((d) => `description:${d}`),
		'income',
		'expenses'
	];

	export let filteredTransactions: Transaction[];
	$: filteredTransactions = transactions.filter((t) => {
		if (filterInputs.length == 0) return true;
		return filters.some((f) => f(t));
	});

	type Filter = (t: Transaction) => boolean;

	let filterInputs: string[] = [];
	let filters: Filter[];
	$: filters = filterInputs.map((input) => {
		const f = input.toLowerCase();
		console.log(f);
		if (f == 'income') {
			return (t: Transaction) => t.amountCents > 0;
		} else if (f == 'expenses') {
			return (t: Transaction) => t.amountCents < 0;
		}
		if (!f.includes(':')) {
			return (t: Transaction) =>
				t.description.toLowerCase().includes(f) ||
				t.category?.toLowerCase().includes(f) ||
				t.type.toLowerCase().includes(f);
		}
		const [command, label] = f.split(':');
		switch (command) {
			case 'type':
			case 't':
				return (t: Transaction) => t.type.toLowerCase() == label;
			case 'category':
			case 'c':
				return (t: Transaction) => t.category?.toLowerCase() == label;
			case 'description':
			case 'd':
				return (t: Transaction) =>
					t.description.toLowerCase().includes(label) || t.category?.toLowerCase().includes(label);
		}
	});
</script>

<InlineAutocomplete
	class={$$restProps.class}
	options={autocompleteOptions}
	bind:selected={filterInputs}
/>
