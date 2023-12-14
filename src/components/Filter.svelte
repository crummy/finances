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
	const accountOptions = Object.fromEntries(
		accounts.map((a) => [`account:${a}`, accountFilter(a)])
	);

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
		const matchesAccountFilters = accountFilterInputs.includes(
			'account:' + t.accountName.toLowerCase()
		);
		if (filterInputs.length == 0) return matchesAccountFilters;
		return matchesFilters && matchesAccountFilters;
	});

	let input: string;
	let filterInputs: string[] = [];
	let accountFilterInputs: string[] = Object.keys(accountOptions).map((i) => i.toLowerCase());

	function onSelection(e: CustomEvent<AutocompleteOption<string>>) {
		filterInputs.push(e.detail.value);
	}

	const popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};
</script>

<div class="p-4">
	<input
		class="input autocomplete"
		type="search"
		name="autocomplete-search"
		bind:value={input}
		placeholder="Search..."
		use:popup={popupSettings}
	/>
	<InputChip bind:input bind:value={filterInputs} name="chips" />
	<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
		<Autocomplete
			bind:input
			options={autocompleteOptions}
			denylist={filterInputs}
			on:selection={onSelection}
		/>
	</div>
</div>
