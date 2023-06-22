<script lang="ts">
	import type { Transaction } from 'akahu';

	export let transactions: Transaction[];
</script>

<table class="table">
	<thead>
		<tr>
			<th>Transaction</th>
			<th>Amount</th>
			<th>Date</th>
			<th>Category</th>
		</tr>
	</thead>
	<tbody>
		{#each transactions as transaction}
			<tr>
				<td> {transaction.description}</td><td>{transaction.amount}</td><td
					>{new Date(transaction.date).toLocaleDateString()}</td
				>
				<td>
					{#if transaction.category}
						<span class="chip">{transaction.category.name}</span>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
