<script lang="ts">
	import InputChip from '@components/InputChip.svelte';

	export let options: string[];
	export let permaOptions: string[];
	export let selected: string[];
	export let permaSelected: string[];
	const allOptions = [...permaOptions, ...options];

	let input = '';

	let autocomplete: string;
	$: {
		if (input.trim().length == 0) {
			autocomplete = '';
		} else {
			const match = allOptions.find((f) => f.toLowerCase().startsWith(input.toLowerCase()));
			if (match) {
				autocomplete = input + match.substring(input.length);
			} else {
				autocomplete = '';
			}
		}
	}

	function listenForEnter(e: KeyboardEvent) {
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

<div class={`flex flex-wrap relative ${$$restProps.class}`}>
	<div class="p-2 absolute pointer-events-none bg-transparent z-10 text-secondary-400-500-token">
		{autocomplete}
	</div>
	<InputChip
		on:keydown={listenForEnter}
		bind:input
		bind:value={selected}
		bind:permaValue={permaOptions}
		name="chips"
		placeholder="category:supermarkets, type:eftpos, expenses..."
	/>
</div>
