<script lang="ts">
	import Chart from 'svelte-frappe-charts';
	import type { Transaction } from 'akahu';
	import { startOfMonth, startOfWeek, startOfDay, addDays } from 'date-fns';
	import { distinct } from '$lib/util';

	export let transactions: Transaction[];
	export let categories: string[];
	let group: 'month' | 'week' | 'day' = 'month';
	const earliest = Math.min(...transactions.map((t) => new Date(t.date).valueOf()));
	const latest = Math.max(...transactions.map((t) => new Date(t.date).valueOf()));
	let months: string[] = [];
	let weeks: string[] = [];
	let days: string[] = [];
	let monthAmounts: { [month: string]: number } = {};
	let weekAmounts: { [week: string]: number } = {};
	let dayAmounts: { [day: string]: number } = {};
	$: {
		let date = new Date(earliest);
		while (date.valueOf() <= latest) {
			const month = startOfMonth(date).toLocaleDateString();
			months.push(month);
			monthAmounts[month] = 0;
			const week = startOfWeek(date).toLocaleDateString();
			weeks.push(week);
			weekAmounts[week] = 0;
			const day = startOfDay(date).toLocaleDateString();
			days.push(day);
			dayAmounts[day] = 0;

			date = addDays(date, 1);
		}
		months = months.filter(distinct);
		weeks = weeks.filter(distinct);
		days = days.filter(distinct);

		for (let transaction of transactions) {
			const date = new Date(transaction.date);
			const month = startOfMonth(date).toLocaleDateString();
			const week = startOfWeek(date).toLocaleDateString();
			const day = startOfDay(date).toLocaleDateString();
			monthAmounts[month] = monthAmounts[month] + transaction.amount;
			weekAmounts[week] = weekAmounts[week] + transaction.amount;
			dayAmounts[day] = dayAmounts[day] + transaction.amount;
		}
		monthAmounts = monthAmounts;
		weekAmounts = weekAmounts;
		dayAmounts = dayAmounts;
	}
	let labels: string[];
	let values: number[];
	$: labels = group === 'month' ? months : group === 'week' ? weeks : days;
	$: values = Object.entries(
		group === 'month' ? monthAmounts : group === 'week' ? weekAmounts : dayAmounts
	)
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([, amount]) => amount);
</script>

<div class:hidden={transactions.length === 0}>
	<Chart data={{ labels, datasets: [{ values }] }} />
	<div class="btn-group variant-filled flex w-fit m-auto">
		<button on:click={() => (group = 'month')}>Months</button>
		<button on:click={() => (group = 'week')}>Weeks</button>
		<button on:click={() => (group = 'day')}>Days</button>
	</div>
</div>
