<script lang="ts">
	import type { Paginated, Transaction } from 'akahu';

	export let transactions: Paginated<Transaction>;
</script>

<ul class="list">
	{#each transactions.items as transaction}
		<li class="list-item">
			{transaction.description} - {transaction.amount}
			{#if transaction.category}
				<span class="chip">{transaction.category.name}</span>
			{/if}
		</li>
	{/each}
</ul>
