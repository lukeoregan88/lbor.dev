<script lang="ts">
	import { getSEOTags, getSEOFromMetadata } from '$lib/seo'

	let { data } = $props()

	const seo = $derived(
		getSEOTags(
			getSEOFromMetadata(data.meta, '/about')
		)
	)
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content={seo.robots} />
	<meta name="author" content={seo.author} />
	
	<!-- Open Graph -->
	<meta property="og:type" content={seo.openGraph.type} />
	<meta property="og:url" content={seo.openGraph.url} />
	<meta property="og:title" content={seo.openGraph.title} />
	<meta property="og:description" content={seo.openGraph.description} />
	<meta property="og:image" content={seo.openGraph.image} />
	
	<!-- Twitter -->
	<meta name="twitter:card" content={seo.twitter.card} />
	<meta name="twitter:title" content={seo.twitter.title} />
	<meta name="twitter:description" content={seo.twitter.description} />
	<meta name="twitter:image" content={seo.twitter.image} />
	
	<!-- Canonical -->
	<link rel="canonical" href={seo.canonicalUrl} />
</svelte:head>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
	</hgroup>

	<div class="prose">
		<data.content />
	</div>
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
