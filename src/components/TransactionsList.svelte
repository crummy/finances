<script lang="ts">
	import type { Transaction } from '../db/types';

	export let transactions: Transaction[];
</script>

<table class="table">
	<thead>
		<tr>
			<th>Transaction</th>
			<th>Amount</th>
			<th>Date</th>
			<th>Type</th>
		</tr>
	</thead>
	<tbody>
		{#each transactions as transaction}
			<tr>
				<td>
					<div>{transaction.description}</div>
					{#if transaction.category}
						<span class="opacity-50 text-sm">{transaction.category}</span>
					{/if}
				</td>
				<td>{transaction.amountCents / 100}</td>
				<td>{new Date(transaction.date).toLocaleDateString()}</td>
				<td>
					<span class="chip">{transaction.type}</span>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
