<script lang="ts">
	import type { PageData } from './$types';
	import Transactions from '@components/Transactions.svelte';
	import { AppBar, LightSwitch, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let data: PageData;
	let selectedAccount = data.accounts[0];
</script>

<main
	class="my-8 m-auto max-w-4xl bg-surface-100-800-token rounded-container-token ring-outline-token shadow-2xl"
>
	<AppBar
		class="flex bg-surface-300-600-token rounded-tl-container-token rounded-tr-container-token"
	>
		<svelte:fragment slot="lead">$</svelte:fragment>
		<h1 class="text-2xl">Finances</h1>
		<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
	</AppBar>
	<div class="p-8">
		<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
			{#each data.accounts as account}
				<RadioItem bind:group={selectedAccount} name="account" value={account}>
					{account.name}
				</RadioItem>
			{/each}
		</RadioGroup>
		<Transactions transactions={data.transactions} />
	</div>
</main>
