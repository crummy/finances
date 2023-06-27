<script lang="ts">
	import Chart from 'svelte-frappe-charts';
	import { startOfMonth, startOfWeek, startOfDay, addDays } from 'date-fns';
	import { distinct } from '$lib/util';
	import type { TransactionAndAccount } from '../routes/+page.server';

	export let transactions: TransactionAndAccount[];
	let group: 'month' | 'week' | 'day' = 'month';
	const earliest = Math.min(...transactions.map((t) => new Date(t.date).valueOf()));
	const latest = Math.max(...transactions.map((t) => new Date(t.date).valueOf()));
	let months: string[] = [];
	let weeks: string[] = [];
	let days: string[] = [];
	let monthExpenses: { [month: string]: number } = {};
	let weekExpenses: { [week: string]: number } = {};
	let dayExpenses: { [day: string]: number } = {};
	let monthIncome: { [month: string]: number } = {};
	let weekIncome: { [week: string]: number } = {};
	let dayIncome: { [day: string]: number } = {};
	$: {
		console.log(
			transactions
				.filter((t) => t.date.startsWith('2023-06'))
				.map((t) => t.amountCents / 100)
				.filter((amount) => amount > 0)
				.reduce((a, b) => a + b, 0)
		);

		let date = new Date(earliest);
		while (date.valueOf() <= latest) {
			const { month, week, day } = dateLabels(date);

			months.push(month);
			monthExpenses[month] = 0;
			monthIncome[month] = 0;
			weeks.push(week);
			weekExpenses[week] = 0;
			weekIncome[week] = 0;
			days.push(day);
			dayExpenses[day] = 0;
			dayIncome[day] = 0;

			date = addDays(date, 1);
		}
		months = months.filter(distinct);
		weeks = weeks.filter(distinct);
		days = days.filter(distinct);

		for (let transaction of transactions) {
			const date = new Date(transaction.date);
			const { month, week, day } = dateLabels(date);
			if (transaction.amountCents < 0) {
				monthExpenses[month] = monthExpenses[month] - transaction.amountCents;
				weekExpenses[week] = weekExpenses[week] - transaction.amountCents;
				dayExpenses[day] = dayExpenses[day] - transaction.amountCents;
			} else {
				monthIncome[month] = monthIncome[month] + transaction.amountCents;
				weekIncome[week] = weekIncome[week] + transaction.amountCents;
				dayIncome[day] = dayIncome[day] + transaction.amountCents;
			}
		}
		console.log(
			Object.entries(monthExpenses)
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map((a) => a[0])
				.filter(distinct)
		);
		monthExpenses = monthExpenses;
		monthIncome = monthIncome;
		weekExpenses = weekExpenses;
		weekIncome = weekIncome;
		dayExpenses = dayExpenses;
		dayIncome = dayIncome;
	}
	let labels: string[];
	let datasets: Array<{ values: number[]; name: string; color: string }>;
	$: labels = (group === 'month' ? months : group === 'week' ? weeks : days).map((d) =>
		new Date(d).toLocaleString()
	);
	$: selectedExpenses =
		group === 'month' ? monthExpenses : group === 'week' ? weekExpenses : dayExpenses;
	$: selectedIncome = group === 'month' ? monthIncome : group === 'week' ? weekIncome : dayIncome;
	$: {
		datasets = [];
		const expenses = Object.entries(selectedExpenses)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([, amount]) => amount / 100);
		const totalExpenses = expenses.reduce((a, b) => a + b, 0);
		if (totalExpenses != 0) {
			datasets.push({ values: expenses, name: 'Expenses', color: '#f44336' });
		}

		const income = Object.entries(selectedIncome)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([, amount]) => amount / 100);
		const totalIncome = income.reduce((a, b) => a + b, 0);
		if (totalIncome != 0) {
			datasets.push({ values: income, name: 'Income', color: '#4caf50' });
		}

		if (totalExpenses == 0 && totalIncome == 0) {
			datasets.push({ values: labels.map(() => 0), name: 'No transactions', color: '#9e9e9e' });
		}
		console.log(datasets);
	}

	function dateLabels(date: Date) {
		const month = startOfMonth(date).valueOf();
		const week = startOfWeek(date).valueOf();
		const day = startOfDay(date).valueOf();
		return {
			month,
			week,
			day
		};
	}
</script>

<div class:hidden={transactions.length === 0}>
	<Chart data={{ labels, datasets }} />
	<div class="btn-group variant-filled flex w-fit m-auto">
		<button on:click={() => (group = 'month')}>Months</button>
		<button on:click={() => (group = 'week')}>Weeks</button>
		<button on:click={() => (group = 'day')}>Days</button>
	</div>
</div>
