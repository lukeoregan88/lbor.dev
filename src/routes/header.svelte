<script lang="ts">
	import Toggle from './toggle.svelte'
	import * as config from '$lib/config'
	import { Menu, X } from 'lucide-svelte'

	let menuOpen = $state(false)

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') menuOpen = false
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<nav>
	<a href="/" class="title">
		<img src="/logo.svg" alt="Logo" class="logo" />
		<b>{config.siteName}</b>
	</a>

	<button
		class="menu-toggle"
		type="button"
		aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={menuOpen}
		aria-controls="header-menu"
		onclick={() => (menuOpen = !menuOpen)}
	>
		{#if menuOpen}
			<X size={22} />
		{:else}
			<Menu size={22} />
		{/if}
	</button>

	<div class:open={menuOpen} class="menu-content" id="header-menu">
		<ul class="links">
			<li><a href="/" onclick={() => (menuOpen = false)}>Home</a></li>
			<li><a href="/writings/" onclick={() => (menuOpen = false)}>Writings</a></li>
			<li><a href="/projects/" onclick={() => (menuOpen = false)}>Projects</a></li>
			<li><a href="/contact/" onclick={() => (menuOpen = false)}>Contact</a></li>
		</ul>

		<Toggle />
	</div>
</nav>

<style>
	nav {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		padding-block: var(--size-7);

		@media (min-width: 768px) {
			display: flex;
			justify-content: space-between;
		}

		.menu-toggle {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: var(--size-2);
			border: 0;
			background: transparent;
			color: inherit;

			@media (min-width: 768px) {
				display: none;
			}
		}

		.menu-content {
			grid-column: 1 / -1;
			display: none;
			padding-top: var(--size-4);

			&.open {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				gap: var(--size-4);
			}

			@media (min-width: 768px) {
				display: flex;
				align-items: center;
				gap: var(--size-7);
				padding-top: 0;
			}
		}

		.links {
			display: grid;
			gap: var(--size-4);
			margin-block: 0;

			@media (min-width: 768px) {
				display: flex;
				gap: var(--size-7);
			}
		}

		a {
			color: inherit;
			text-decoration: none;
		}

		.title {
			display: flex;
			align-items: center;
			gap: var(--size-2);

			.logo {
				width: 15px;
				height: 15px;
				border-radius: 0;
			}
		}
	}
</style>
