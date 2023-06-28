<script lang="ts">
	import InputChip from '@components/InputChip.svelte';

	export let options: string[];
	export let permaOptions: string[];
	export let selected: string[];
	export let permaSelected: string[];

	let timer;

	const debounce = (input: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (input.length <= 1) {
				autocomplete = '';
				return;
			}
			autocomplete = options.find((f) => f.toLowerCase().startsWith(input.toLowerCase())) || '';
		}, 200);
	};

	let input = '';

	$: debounce(input);

	let autocomplete: string;

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
	<InputChip
		on:keydown={listenForEnter}
		bind:input
		bind:value={selected}
		{permaOptions}
		bind:permaValue={permaSelected}
		name="chips"
		placeholder="category:supermarkets, type:eftpos, expenses..."
	>
		<div
			class="p-2 absolute pointer-events-none bg-transparent z-10 text-secondary-400-500-token top-0 left-0"
		>
			{autocomplete}
		</div>
	</InputChip>
</div>
