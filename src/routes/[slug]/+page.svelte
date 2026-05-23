<script lang="ts">
	import { formatDate } from '$lib/utils'
	import { getSEOFromMetadata } from '$lib/seo'
	import SeoHead from '$lib/components/SeoHead.svelte'
	import RelatedPosts from '$lib/components/RelatedPosts.svelte'
	import PageLinks from '$lib/components/PageLinks.svelte'
	import { getArticleSchema, getBreadcrumbSchema } from '$lib/schema'

	let { data } = $props()

	const seoProps = $derived(
		getSEOFromMetadata({ ...data.meta, slug: data.slug }, `/${data.slug}/`)
	)

	const jsonLd = $derived([
		getArticleSchema({
			title: data.meta.title,
			description: data.meta.description,
			slug: data.slug,
			date: data.meta.date,
			categories: data.meta.categories
		}),
		getBreadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: data.meta.title, path: `/${data.slug}/` }
		])
	])
</script>

<SeoHead {...seoProps} jsonLd={jsonLd} />

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

	<RelatedPosts posts={data.relatedPosts} />
	<PageLinks />
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
