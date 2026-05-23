<script lang="ts">
	import { getSEOFromMetadata } from '$lib/seo'
	import SeoHead from '$lib/components/SeoHead.svelte'
	import PageLinks from '$lib/components/PageLinks.svelte'
	import { getBreadcrumbSchema } from '$lib/schema'

	let { data } = $props()

	const seoProps = $derived(getSEOFromMetadata(data.meta, '/contact/'))
	const jsonLd = $derived([
		getBreadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: data.meta.title, path: '/contact/' }
		])
	])
</script>

<SeoHead {...seoProps} jsonLd={jsonLd} />

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
	</hgroup>

	<div class="prose">
		<data.content />
	</div>

	<PageLinks />
</article>

<style>
	article {
		max-inline-size: var(--size-content-3);
		margin-inline: auto;

		h1 {
			text-transform: capitalize;
		}

		.prose {
			margin-top: var(--size-7);
		}
	}
</style>
