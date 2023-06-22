<script lang="ts">
	import type { PageData } from './$types';
	import Transactions from '@components/Transactions.svelte';
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';

	export let data: PageData;
	let selectedAccount = data.accounts[0];
</script>

<main
	class="my-8 m-auto max-w-4xl bg-surface-100-800-token rounded-container-token ring-outline-token shadow-2xl"
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
	<div class="p-8">
		<Transactions transactions={data.transactions} />
	</div>
</main>
