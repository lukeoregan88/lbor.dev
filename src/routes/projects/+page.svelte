<script lang="ts">
	import { getSEOFromMetadata } from '$lib/seo'
	import SeoHead from '$lib/components/SeoHead.svelte'
	import PageLinks from '$lib/components/PageLinks.svelte'
	import { getBreadcrumbSchema } from '$lib/schema'

	let { data } = $props()

	const seoProps = $derived(getSEOFromMetadata(data.meta, '/projects/'))
	const jsonLd = $derived([
		getBreadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: data.meta.title, path: '/projects/' }
		])
	])
</script>

<SeoHead {...seoProps} {jsonLd} />

<article class="page-content">
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
		h1 {
			text-transform: capitalize;
		}

		.prose {
			margin-top: var(--size-7);
		}
	}
</style>
