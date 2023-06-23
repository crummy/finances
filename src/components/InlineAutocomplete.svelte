<script lang="ts">
	import InputChip from '@components/InputChip.svelte';

	export let options: string[];
	export let selected: string[];

	let input = '';

	let autocomplete: string;
	$: autocomplete =
		input.length > 0
			? options.find((f) => f.toLowerCase().startsWith(input.toLowerCase())) ?? ''
			: '';

	function listenForTab(e: KeyboardEvent) {
		if (e.key === 'Enter' && autocomplete != '') {
			selected = [...selected, autocomplete];
			input = '';
			e.preventDefault();
		} else if (e.key === 'Escape' && autocomplete != '') {
			autocomplete = '';
			e.preventDefault();
		}
	}
</script>

<div class="flex flex-wrap gap-2 relative">
	<div class="p-2 absolute pointer-events-none bg-transparent z-20">{autocomplete}</div>
	<InputChip
		on:keydown={listenForTab}
		bind:input
		bind:value={selected}
		name="chips"
		placeholder="category:supermarkets, type:eftpos, expenses..."
	/>
</div>
