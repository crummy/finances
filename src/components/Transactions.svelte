<script lang="ts">
	import type { Paginated, Transaction } from 'akahu';
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import type { EnrichedTransaction } from 'akahu/dist/models/transactions';
	import { distinct } from '$lib/util';
	import Chart from '@components/Chart.svelte';

	export let transactions: Paginated<Transaction>;

	let categoryInput = '';
	let allCategories = transactions.items
		.filter((i) => 'category' in i)
		.map((i: EnrichedTransaction) => i.category.name)
		.filter(distinct);
	let categories: string[] = [];

	let filteredTransactions: Transaction[] = [];
	$: filteredTransactions = transactions.items.filter((t) => {
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
</script>

<div class="card p-1">
	<InputChip
		bind:input={categoryInput}
		bind:value={categories}
		whitelist={allCategories}
		placeholder="Enter a category"
		on:submit={() => selectCategory(categoryInput)}
	/>

	<div class="w-full p-4 overflow-y-auto" tabindex="-1" class:hidden={categoryInput === ''}>
		<Autocomplete
			bind:input={categoryInput}
			options={allCategories.map((c) => ({ label: c, value: c }))}
			allowList={allCategories}
			on:selection={(e) => selectCategory(e.detail.label)}
		/>
	</div>
</div>

<Chart {categories} transactions={filteredTransactions} />

<ul class="list">
	{#each filteredTransactions as transaction}
		<li class="list-item">
			{transaction.description} - {transaction.amount} - {transaction.date}
			{#if transaction.category}
				<span class="chip">{transaction.category.name}</span>
			{/if}
		</li>
	{/each}
</ul>
