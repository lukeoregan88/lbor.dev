<script lang="ts">
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'
	import SeoHead from '$lib/components/SeoHead.svelte'
	import { getPersonSchema, getWebsiteSchema } from '$lib/schema'

	let { data } = $props()
</script>

<SeoHead
	title={config.title}
	description={config.description}
	url="/"
	jsonLd={[getWebsiteSchema(), getPersonSchema()]}
/>

<section>
	<h1 class="heading">{config.homepageHeading}</h1>

	<p class="intro">
		I write about
		<a href="/building-a-uk-weather-platform-with-sveltekit/">SvelteKit</a>,
		<a href="/how-to-disable-html-in-wordpress-comments-without-a-plugin/">WordPress</a>,
		<a href="/hostinger-review-2026/">hosting and performance</a>,
		and practical notes on building for the web. Explore my
		<a href="/projects/">projects</a> or
		<a href="/about/">learn more about my work</a>.
	</p>

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
		font-size: var(--font-size-fluid-2);
		font-weight: var(--font-weight-6);
		margin-bottom: var(--size-4);
		max-inline-size: var(--size-content-3);
	}

	.intro {
		margin-bottom: var(--size-8);
		max-inline-size: var(--size-content-3);
		color: var(--text-2);

		a {
			color: inherit;
		}
	}

	.posts {
		display: grid;
		gap: var(--size-7);

		.post {
			max-inline-size: var(--size-content-3);

			&:not(:last-child) {
				border-bottom: 1px solid var(--border);
				padding-bottom: var(--size-7);
			}

			.title {
				font-size: var(--font-size-fluid-3);
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
