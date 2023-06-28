<script lang="ts">
	import type { PageData } from './$types';
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import Chart from '@components/Chart.svelte';
	import TransactionsList from '@components/TransactionsList.svelte';
	import Filter from '@components/Filter.svelte';
	import { fly } from 'svelte/transition';
	import type { TransactionAndAccount } from './+page.server';
	import ExpandTransactions from '@components/ExpandTransactions.svelte';

	export let data: PageData;

	let filteredTransactions: TransactionAndAccount[] = data.transactions;

	let showTransactions = false;

	$: {
		console.log(filteredTransactions.length);
	}
</script>

<main
	class="mt-8 m-auto max-w-4xl bg-surface-100-800-token rounded-container-token ring-outline-token shadow-2xl z-10 relative"
>
	<AppBar
		class="flex bg-surface-300-600-token rounded-tl-container-token rounded-tr-container-token"
		slotTrail="h-full relative"
	>
		<svelte:fragment slot="lead">$</svelte:fragment>
		<h1 class="text-2xl">Finances</h1>
		<svelte:fragment slot="trail">
			<LightSwitch />
		</svelte:fragment>
	</AppBar>

	<Filter transactions={data.transactions} bind:filteredTransactions class="p-4" />

	<Chart transactions={filteredTransactions} />

	<ExpandTransactions
		bind:expanded={showTransactions}
		transactionCount={filteredTransactions.length}
	/>
</main>
<div class="max-w-3xl m-auto grid justify-center">
	{#if showTransactions}
		<div transition:fly={{ y: -400, duration: 200 }} class="overflow-hidden relative z-0">
			<TransactionsList transactions={filteredTransactions} />
		</div>
	{/if}
</div>
