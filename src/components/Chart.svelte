<script lang="ts">
	import Chart from 'svelte-frappe-charts';
	import regression from 'regression';
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
		monthExpenses = monthExpenses;
		monthIncome = monthIncome;
		weekExpenses = weekExpenses;
		weekIncome = weekIncome;
		dayExpenses = dayExpenses;
		dayIncome = dayIncome;
	}
	let trend: 'polynomial' | 'linear' | 'exponential' | null = null;
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
		datasets.push({ values: expenses, name: 'Expenses', color: '#f44336' });

		const income = Object.entries(selectedIncome)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([, amount]) => amount / 100);
		datasets.push({ values: income, name: 'Income', color: '#4caf50' });

		const regressionData = Object.entries(selectedExpenses)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([, amount], i) => [i, amount / 100])
			.filter(([i]) => i != 0 && i != expenses.length - 1); // remove first and last - they have incomplete data
		const linear = regression.linear(regressionData);
		const polynomial = regression.polynomial(regressionData);
		const exponential = regression.exponential(regressionData);
		let predict: (x: number) => [number, number];
		if (trend === 'linear') predict = linear.predict;
		else if (trend === 'polynomial') predict = polynomial.predict;
		else if (trend === 'exponential') predict = exponential.predict;
		else predict = [linear, polynomial, exponential].sort((a, b) => b.r2 - a.r2)[0].predict;
		datasets.push({
			values: [0, ...labels.map((_, x) => predict(x)[1]), 0],
			name: 'Trend',
			color: '#2196f3'
		});
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

<div class:hidden={transactions.length === 0} class="pb-4">
	<Chart data={{ labels, datasets }} />
	<div class="flex gap-2 justify-around">
		<div class="btn-group variant-ghost flex">
			<button
				class="btn"
				class:variant-filled={group === 'month'}
				on:click={() => (group = 'month')}
			>
				Months
			</button>
			<button class="btn" class:variant-filled={group === 'week'} on:click={() => (group = 'week')}>
				Weeks
			</button>
			<button class="btn" class:variant-filled={group === 'day'} on:click={() => (group = 'day')}>
				Days
			</button>
		</div>
		<div class="btn-group flex variant-ghost">
			<button class="btn" class:variant-filled={trend === null} on:click={() => (trend = null)}>
				Auto
			</button>
			<button
				class="btn"
				class:variant-filled={trend === 'linear'}
				on:click={() => (trend = 'linear')}>Linear</button
			>
			<button
				class="btn"
				class:variant-filled={trend === 'polynomial'}
				on:click={() => (trend = 'polynomial')}>Polynomial</button
			>
			<button
				class="btn"
				class:variant-filled={trend === 'exponential'}
				on:click={() => (trend = 'exponential')}>Exponential</button
			>
		</div>
	</div>
</div>
