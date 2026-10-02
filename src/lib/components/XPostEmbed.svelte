<script lang="ts">
	import { onMount } from 'svelte'

	let embedRoot: HTMLElement

	onMount(() => {
		// X's official post embed is progressive: this blockquote remains readable if widgets.js fails.
		// https://help.x.com/en/using-x/how-to-embed-a-post
		const browserWindow = window as Window & {
			twttr?: { widgets?: { load: (root?: HTMLElement) => void } }
		}

		if (browserWindow.twttr?.widgets) {
			browserWindow.twttr.widgets.load(embedRoot)
			return
		}

		let script = document.querySelector<HTMLScriptElement>('script[data-x-embed-widgets]')
		const shouldAppend = !script

		if (!script) {
			script = document.createElement('script')
			script.src = 'https://platform.x.com/widgets.js'
			script.async = true
			script.dataset.xEmbedWidgets = 'true'
		}

		const renderEmbed = () => browserWindow.twttr?.widgets?.load(embedRoot)
		script.addEventListener('load', renderEmbed, { once: true })

		if (shouldAppend) document.head.append(script)

		return () => script?.removeEventListener('load', renderEmbed)
	})
</script>

<figure class="x-post-embed" bind:this={embedRoot}>
	<blockquote class="twitter-tweet">
		<p lang="en" dir="ltr">
			Due to AI, I have disabled external pull requests on all my repos.<br /><br />Open source, as
			we have known it, was fun while it lasted. (It’s been 15 years for me)<br /><br />I will still
			maintain projects and handle issues.
		</p>
		&mdash; Sindre Sorhus (@sindresorhus)
		<a
			href="https://x.com/sindresorhus/status/2105693826690298314"
			target="_blank"
			rel="noopener noreferrer">October 1, 2026</a
		>
	</blockquote>
</figure>

<style>
	.x-post-embed {
		width: 100%;
		max-width: 550px;
		margin-block: var(--size-6);
		margin-inline: auto;
	}

	:global(.twitter-tweet),
	:global(iframe.twitter-tweet-rendered) {
		box-sizing: border-box;
		width: 100% !important;
		max-width: 100% !important;
		min-width: 0 !important;
	}
</style>
