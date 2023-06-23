<script lang="ts">
	import InputChip from '@components/InputChip.svelte';

	export let options: string[];
	export let selected: string[];

	let input = '';

	let autocomplete: string;
	$: {
		if (input.trim().length == 0) {
			autocomplete = '';
		} else {
			const match = options.find((f) => f.toLowerCase().startsWith(input.toLowerCase()));
			if (match) {
				autocomplete = input + match.substring(input.length);
			} else {
				autocomplete = '';
			}
		}
	}

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

	$: {
		console.log(autocomplete);
	}
</script>

<div class={`flex flex-wrap relative ${$$restProps.class}`}>
	<div class="p-2 absolute pointer-events-none bg-transparent z-10 text-secondary-400-500-token">
		{autocomplete}
	</div>
	<InputChip
		on:keydown={listenForTab}
		bind:input
		bind:value={selected}
		name="chips"
		placeholder="category:supermarkets, type:eftpos, expenses..."
	/>
</div>
