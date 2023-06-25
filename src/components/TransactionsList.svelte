<script lang="ts">
	import type { Transaction } from '../db/types';

	export let transactions: Transaction[];
</script>

<section>
	{#each transactions as transaction, i}
		<div
			class={'grid grid-cols-[5fr_1fr_1fr] p-2 ' +
				(i % 2 === 0 ? 'bg-surface-300-600-token' : 'bg-surface-400-500-token')}
		>
			<span>
				<span class="font-bold block"
					>{transaction.description} <span class="chip">{transaction.type}</span>
				</span>
				{#if transaction.category}
					<span class="opacity-50 text-sm">{transaction.category}</span>
				{/if}
			</span>
			<span>{new Date(transaction.date).toLocaleDateString()}</span>

			<span>{transaction.amountCents / 100}</span>
		</div>
	{/each}
</section>
