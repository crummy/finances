<script lang="ts">
	import { distinct } from '$lib/util';
	import type { TransactionAndAccount } from '../routes/+page.server';
	import {
		Autocomplete,
		type AutocompleteOption,
		InputChip,
		type PopupSettings
	} from '@skeletonlabs/skeleton';

	export let transactions: TransactionAndAccount[];

	const categories: string[] = transactions
		.map((transaction) => transaction.category?.toLowerCase())
		.filter((category) => category != null)
		.filter(distinct) as string[];
	const categoryFilter = (category: string) => (t: TransactionAndAccount) => {
		return t.category?.toLowerCase() == category.toLowerCase();
	};
	const categoryOptions = Object.fromEntries(
		categories.map((c) => [`category:${c}`, categoryFilter(c)])
	);

	const types: string[] = transactions
		.map((transaction) => transaction.type.toLowerCase())
		.filter(distinct);
	const typeFilter = (type: string) => (t: TransactionAndAccount) => {
		return t.type?.toLowerCase() == type.toLowerCase();
	};
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
	const accountOptions = Object.fromEntries(accounts.map((a) => [a, accountFilter(a)]));

	const autocompleteOptions: AutocompleteOption<string>[] = [
		...Object.keys(categoryOptions),
		...Object.keys(typeOptions),
		...descriptions,
		'income',
		'expenses'
	].map((el) => ({ label: el.toLowerCase(), value: el.toLowerCase() }));

	type Filter = (t: TransactionAndAccount) => boolean;
	const filters: Record<string, Filter> = {
		...categoryOptions,
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
		const matchesAccountFilters = accountFilterInputs.includes(t.accountName.toLowerCase());
		if (filterInputs.length == 0) return matchesAccountFilters;
		return matchesFilters && matchesAccountFilters;
	});

	let input: string;
	let filterInputs: string[] = [];
	let accountFilterInputs: string[] = Object.keys(accountOptions).map((i) => i.toLowerCase());

	function onSelection(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		if (e.key === 'Enter') {
			select(e.currentTarget.value);
			input = '';
		}
	}

	function select(value: string) {
		filterInputs = [...filterInputs, value];
	}

	function deselect(value: string) {
		filterInputs = filterInputs.filter((f) => f != value);
	}

	function toggleAccount(account: string) {
		if (accountFilterInputs.includes(account.toLowerCase())) {
			accountFilterInputs = accountFilterInputs.filter((f) => f != account.toLowerCase());
		} else {
			accountFilterInputs = [...accountFilterInputs, account.toLowerCase()];
		}
	}
</script>

<div class="p-4">
	<input
		bind:value={input}
		class="input"
		placeholder="Search..."
		list="filters"
		on:keydown={(e) => onSelection(e)}
	/>
	<datalist id="filters">
		{#each autocompleteOptions as option}
			<option value={option.value} on:click={() => select(option.value)} />
		{/each}
	</datalist>
	<div class="flex gap-1">
		{#each accounts as account}
			<button
				class="chip"
				class:variant-soft={!accountFilterInputs.includes(account)}
				class:variant-filled={accountFilterInputs.includes(account)}
				on:click={() => toggleAccount(account)}
			>
				<span>x</span>
				<span>{account}</span>
			</button>
		{/each}

		{#each filterInputs as filter}
			<button class="chip variant-filled" on:click={() => deselect(filter)}>
				<span>x</span>
				<span>{filter}</span>
			</button>
		{/each}
	</div>
</div>
