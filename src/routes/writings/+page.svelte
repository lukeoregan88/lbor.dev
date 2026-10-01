<script lang="ts">
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'
	import SeoHead from '$lib/components/SeoHead.svelte'
	import { getBreadcrumbSchema } from '$lib/schema'

	let { data } = $props()
</script>

<SeoHead
	title={`Writings | ${config.siteName}`}
	description="Writing about building for the web, WordPress, SvelteKit, and practical development notes."
	url="/writings/"
	jsonLd={[
		getBreadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: 'Writings', path: '/writings/' }
		])
	]}
/>

<section class="page-content">
	<h1 class="heading">Writings</h1>

	<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href={`/${post.slug}/`} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.heading {
		margin-bottom: var(--size-8);
	}

	.posts {
		display: grid;
		gap: var(--size-7);

		.post {
			&:not(:last-child) {
				border-bottom: 1px solid var(--border);
				padding-bottom: var(--size-7);
			}

			.title {
				font-size: var(--font-size-fluid-1);
				text-transform: capitalize;
			}

			.date {
				color: var(--text-2);
			}

			.description {
				margin-top: var(--size-3);
			}
		}
	}
</style>
