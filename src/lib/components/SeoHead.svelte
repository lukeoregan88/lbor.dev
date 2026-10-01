<script lang="ts">
	import type { SEOProps } from '$lib/seo'
	import { getSEOTags } from '$lib/seo'
	import { getJsonLdScript } from '$lib/json-ld'

	interface Props extends SEOProps {
		jsonLd?: Record<string, unknown>[]
	}

	let { jsonLd = [], ...seoProps }: Props = $props()

	const seo = $derived(getSEOTags(seoProps))
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content={seo.robots} />
	<meta name="author" content={seo.author} />

	<meta property="og:type" content={seo.openGraph.type} />
	<meta property="og:url" content={seo.openGraph.url} />
	<meta property="og:title" content={seo.openGraph.title} />
	<meta property="og:description" content={seo.openGraph.description} />
	<meta property="og:image" content={seo.openGraph.image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	{#if seo.openGraph.publishedTime}
		<meta property="article:published_time" content={seo.openGraph.publishedTime} />
	{/if}
	{#if seo.openGraph.modifiedTime}
		<meta property="article:modified_time" content={seo.openGraph.modifiedTime} />
	{/if}
	{#if seo.openGraph.tags && seo.openGraph.tags.length > 0}
		{#each seo.openGraph.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<meta name="twitter:card" content={seo.twitter.card} />
	<meta name="twitter:title" content={seo.twitter.title} />
	<meta name="twitter:description" content={seo.twitter.description} />
	<meta name="twitter:image" content={seo.twitter.image} />

	<link rel="canonical" href={seo.canonicalUrl} />

	{#each jsonLd as schema (JSON.stringify(schema))}
		<!-- Script-breaking characters are escaped by getJsonLdScript; this is not arbitrary HTML. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html getJsonLdScript(schema)}
	{/each}
</svelte:head>
