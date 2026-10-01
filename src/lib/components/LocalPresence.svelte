<script lang="ts">
	import { onMount } from 'svelte'

	const timeZone = 'Europe/London'

	function getPresence() {
		const now = new Date()
		const hour = Number(
			new Intl.DateTimeFormat('en-GB', {
				timeZone,
				hour: '2-digit',
				hourCycle: 'h23'
			})
				.formatToParts(now)
				.find((part) => part.type === 'hour')?.value
		)

		return {
			time: new Intl.DateTimeFormat('en-GB', {
				timeZone,
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23'
			}).format(now),
			sleeping: hour >= 18 || hour < 6
		}
	}

	let presence = $state(getPresence())

	onMount(() => {
		const timer = window.setInterval(() => {
			presence = getPresence()
		}, 60_000)

		return () => window.clearInterval(timer)
	})
</script>

<div class="presence" aria-label="Location and local time">
	<svg
		class={`character${presence.sleeping ? ' sleeping' : ''}`}
		viewBox="0 0 32 32"
		role="img"
		aria-label={presence.sleeping ? 'Sleeping' : 'Awake'}
	>
		<circle class="face" cx="16" cy="16" r="13" />
		{#if presence.sleeping}
			<path class="eyes" d="M9 15c1.2 1.3 2.4 1.3 3.6 0m6.8 0c1.2 1.3 2.4 1.3 3.6 0" />
			<text class="zzz" x="21" y="8">z</text>
		{:else}
			<g class="awake-eyes">
				<circle cx="12" cy="14" r="1.5" />
				<circle cx="20" cy="14" r="1.5" />
			</g>
			<path class="smile" d="M12 19c2.4 2 5.6 2 8 0" />
		{/if}
	</svg>
	<span>London, UK</span>
	<span aria-hidden="true">·</span>
	<time>{presence.time}</time>
	<span class="sr-only">local time, {presence.sleeping ? 'sleeping' : 'awake'}</span>
</div>

<style>
	.presence {
		display: flex;
		align-items: center;
		gap: var(--size-2);
		margin-bottom: var(--size-5);
		color: var(--text-2);
		font-size: var(--font-size-0);
	}

	.character {
		inline-size: var(--size-6);
		block-size: var(--size-6);
		overflow: visible;
	}

	.face {
		fill: var(--brand);
	}

	.awake-eyes circle,
	.smile,
	.eyes {
		fill: none;
		stroke: var(--surface-1);
		stroke-width: 1.8;
		stroke-linecap: round;
	}

	.awake-eyes circle {
		fill: var(--surface-1);
	}

	.awake-eyes {
		animation: blink 4s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: center;
	}

	.zzz {
		fill: var(--text-2);
		font: 700 9px sans-serif;
		animation: drift 2s ease-in-out infinite;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@keyframes blink {
		0%,
		46%,
		50%,
		100% {
			transform: scaleY(1);
		}
		48% {
			transform: scaleY(0.12);
		}
	}

	@keyframes drift {
		0%,
		100% {
			transform: translateY(1px);
		}
		50% {
			transform: translateY(-2px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.awake-eyes,
		.zzz {
			animation: none;
		}
	}
</style>
