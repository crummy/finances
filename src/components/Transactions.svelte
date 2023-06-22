<script lang="ts">
	import Chart from '@components/Chart.svelte';
	import TransactionsList from '@components/TransactionsList.svelte';
	import type { Transaction } from '../db/types';

	export let transactions: Transaction[];

	let categories: string[] = [];

	let filteredTransactions: Transaction[] = [];
	$: filteredTransactions = transactions.filter((t) => {
		const description = t.description.toLowerCase();
		const category = t.category?.toLowerCase() ?? '';
		const query = search.toLowerCase();
		return description.includes(query) || category.includes(query);
	});

	let showIncome = true;
	let showExpenses = true;
	let search = '';
</script>

<div class="grid grid-cols-[1fr_auto]">
	<input type="text" placeholder="Filter transactions" bind:value={search} class="input p-1" />
	<form>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:value={showIncome} />
			Show Income
		</label>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:value={showExpenses} />
			Show Expenses
		</label>
	</form>
</div>

<Chart {categories} transactions={filteredTransactions} />

<TransactionsList transactions={filteredTransactions} />
