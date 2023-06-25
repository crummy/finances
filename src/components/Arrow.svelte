<script lang="ts">
	export let orientation: 'up' | 'down' | 'left' | 'right' = 'down';
	$: rotate = {
		up: 'rotate(225deg)',
		down: 'rotate(45deg)',
		left: 'rotate(135deg)',
		right: 'rotate(315deg)'
	}[orientation];
</script>

<div class="arrow" style={`transform: ${rotate}`} />

<style>
	.arrow {
		box-sizing: border-box;
		height: 1em;
		width: 1em;
		border-style: solid;
		border-color: #9dc0f0;
		border-width: 0 2px 2px 0;
	}
</style>
