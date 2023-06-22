<script lang="ts">
	import type { Paginated, Transaction } from 'akahu';
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import type { EnrichedTransaction } from 'akahu/dist/models/transactions';
	import { distinct } from '$lib/util';
	import Chart from '@components/Chart.svelte';
	import TransactionsList from '@components/TransactionsList.svelte';

	export let transactions: Paginated<Transaction>;

	let categoryInput = '';
	let allCategories = transactions.items
		.filter((i) => 'category' in i)
		.map((i: EnrichedTransaction) => i.category.name)
		.filter(distinct);
	let categories: string[] = [];

	let filteredTransactions: Transaction[] = [];
	$: filteredTransactions = transactions.items.filter((t) => {
		if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
		if (categories.length === 0) return true;
		if ('category' in t) {
			return categories.includes(t.category.name);
		}
		return false;
	});
	filteredTransactions.map((t) => t.amount);

	function selectCategory(category: string) {
		console.log(category);
		categories = [...categories, category];
		categoryInput = '';
	}

	let autocompleteOpen = false;
	let search = '';
</script>

<div class="grid grid-cols-2 gap-4">
	<input type="text" placeholder="Filter transactions" bind:value={search} class="input" />

	<div class="p-1 bg-secondary-backdrop-token">
		<InputChip
			on:focus={() => (autocompleteOpen = true)}
			bind:input={categoryInput}
			bind:value={categories}
			whitelist={allCategories}
			placeholder="Enter a category"
			on:submit={() => selectCategory(categoryInput)}
		/>

		<div class="w-full p-4 overflow-y-auto" tabindex="-1" class:hidden={!autocompleteOpen}>
			<Autocomplete
				bind:input={categoryInput}
				options={allCategories.map((c) => ({ label: c, value: c }))}
				allowList={allCategories}
				on:selection={(e) => selectCategory(e.detail.label)}
			/>
		</div>
	</div>
</div>

<Chart {categories} transactions={filteredTransactions} />

<TransactionsList transactions={filteredTransactions} />
