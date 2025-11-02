<script lang="ts">
	import { formatDate } from '$lib/utils'
	import { getSEOTags, getSEOFromMetadata } from '$lib/seo'

	let { data } = $props()

	const seo = $derived(
		getSEOTags(
			getSEOFromMetadata(
				{ ...data.meta, slug: data.slug },
				`/${data.slug}`
			)
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
	{#if seo.openGraph.publishedTime}
		<meta property="article:published_time" content={seo.openGraph.publishedTime} />
	{/if}
	{#if seo.openGraph.tags && seo.openGraph.tags.length > 0}
		{#each seo.openGraph.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	
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
		<p>Published at {formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="tags">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

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

		h1 + p {
			margin-top: var(--size-2);
			color: var(--text-2);
		}

		.tags {
			display: flex;
			gap: var(--size-3);
			margin-top: var(--size-7);
      margin-bottom: var(--size-7);

			> * {
				padding: var(--size-2) var(--size-3);
				border-radius: var(--radius-round);
			}
		}
	}
</style>
