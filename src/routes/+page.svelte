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
</script>

<main
	class="mt-8 m-auto max-w-4xl bg-surface-100-800-token rounded-container-token ring-outline-token shadow-2xl z-10 relative"
>
	<AppBar
		class="flex rounded-tl-container-token rounded-tr-container-token text-secondary-800-100-token"
		background="bg-primary-100-800-token"
		slotTrail="h-full relative flex-shrink"
	>
		<svelte:fragment slot="lead">
			<h1 class="text-2xl flex-grow font-bold">Finances</h1>
		</svelte:fragment>
		<svelte:fragment slot="trail">
			<LightSwitch />
		</svelte:fragment>
	</AppBar>

	<Filter transactions={data.transactions} bind:filteredTransactions />

	<Chart transactions={filteredTransactions} />

	<hr />

	<ExpandTransactions
		class="bg-surface-200-700-token rounded-bl-container-token rounded-br-container-token"
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
