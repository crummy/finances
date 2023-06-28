<script lang="ts">
	export let expanded = false;
	export let transactionCount = 0;
	let className = '';
	export { className as class };
</script>

<div
	class={`container cursor-pointer grid grid-cols-3 p-4 w-full justify-center justify-items-center ${className}`}
	on:click={() => (expanded = !expanded)}
	on:keypress={() => (expanded = !expanded)}
>
	<div class="arrow" style={`transform: ${expanded ? 'rotate(225deg)' : 'rotate(45deg)'}`} />
	{transactionCount} transaction{transactionCount === 1 ? '' : 's'}
	<div class="arrow" style={`transform: ${expanded ? 'rotate(225deg)' : 'rotate(45deg)'}`} />
</div>

<style>
	.arrow {
		box-sizing: border-box;
		height: 1em;
		width: 1em;
		border-style: solid;
		border-color: #9dc0f0;
		border-width: 0 2px 2px 0;
	}

	.container .arrow {
		position: relative;
		top: 0;
	}

	.container:hover .arrow {
		top: 0.25rem;
	}
</style>
