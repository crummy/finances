<script lang="ts">
	import type { PageData } from './$types';
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import Chart from '@components/Chart.svelte';
	import TransactionsList from '@components/TransactionsList.svelte';
	import Filter from '@components/Filter.svelte';
	import type { Transaction } from '../db/types';
	import Arrow from '@components/Arrow.svelte';
	import { fly } from 'svelte/transition';

	export let data: PageData;
	let selectedAccount = data.accounts[0];

	let filteredTransactions: Transaction[] = data.transactions;

	function grow(node, { delay = 0, duration = 1000 }) {
		return {
			delay,
			duration,
			css: (t, u) => `top: ${u}px`
		};
	}

	let showTransactions = false;
</script>

<main
	class="mt-8 m-auto max-w-4xl bg-surface-100-800-token rounded-container-token ring-outline-token shadow-2xl z-10 relative"
>
	<AppBar
		class="flex bg-surface-300-600-token rounded-tl-container-token rounded-tr-container-token"
		padding="p-0"
		slotLead="p-4"
		slotDefault="p-4"
		slotTrail="h-full relative"
	>
		<svelte:fragment slot="lead">$</svelte:fragment>
		<h1 class="text-2xl">Finances</h1>
		<svelte:fragment slot="trail">
			<LightSwitch />
			<button
				class="bg-surface-400-500-token h-full p-2 m-0 rounded-tr-container-token"
				use:popup={{
					event: 'click',
					target: 'account-selection',
					placement: 'bottom'
				}}
			>
				{selectedAccount.name} ▼
			</button>
			<div data-popup="account-selection" class="btn-group-vertical variant-filled">
				{#each data.accounts as account}
					<button onclick={() => (selectedAccount = account)} name="account" value={account}>
						{account.name}
					</button>
				{/each}
			</div>
		</svelte:fragment>
	</AppBar>

	<Filter transactions={data.transactions} bind:filteredTransactions class="p-4" />

	<Chart transactions={filteredTransactions} />

	<button
		class="p-4 w-full flex justify-center relative top-0 hover:top-1"
		on:click={() => (showTransactions = !showTransactions)}
	>
		<Arrow orientation={showTransactions ? 'up' : 'down'} />
	</button>
</main>
<div class="max-w-3xl m-auto grid justify-center">
	{#if showTransactions}
		<div transition:fly={{ y: -400, duration: 200 }} class="overflow-hidden relative z-0">
			<TransactionsList transactions={filteredTransactions} />
		</div>
	{/if}
</div>
