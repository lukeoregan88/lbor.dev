<script lang="ts">
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'
	import SeoHead from '$lib/components/SeoHead.svelte'
	import LocalPresence from '$lib/components/LocalPresence.svelte'
	import { getPersonSchema, getWebsiteSchema } from '$lib/schema'

	let { data } = $props()
</script>

<SeoHead
	title={config.title}
	description={config.description}
	url="/"
	jsonLd={[getWebsiteSchema(), getPersonSchema()]}
/>

<article class="page-content">
	<h1>{config.homepageHeading}</h1>
	<LocalPresence />

	<p class="intro">
		I'm a senior full-stack developer and digital strategist based in the UK. For more than 15
		years, I've been building high-performance websites and web applications, bringing a background
		in graphic design together with hands-on development.
	</p>

	<p>
		I currently work as a Senior Full-Stack &amp; Multimedia Developer at
		<a href="https://dda.co.uk/" target="_blank" rel="noopener noreferrer">Direct Design Studio</a>,
		building web applications and CMS-driven websites from design and architecture through to
		deployment and ongoing optimisation.
	</p>

	<h2>What I do</h2>
	<p>
		My work spans full-stack development, WordPress and other CMS platforms, e-commerce, and SEO and
		performance optimisation. I care about making websites useful, fast, and straightforward to
		maintain.
	</p>

	<section class="latest-writings" aria-labelledby="latest-writings-heading">
		<h2 id="latest-writings-heading">Latest writings</h2>
		<ul class="latest-posts">
			{#each data.posts as post}
				<li>
					<a class="title" href={`/${post.slug}/`}>{post.title}</a>
					<time datetime={post.date}>{formatDate(post.date)}</time>
				</li>
			{/each}
		</ul>
		<a class="all-writings" href="/writings/">View all writings</a>
	</section>

	<p>
		Away from work, I enjoy films, watching sports, exploring, being a nerd, and the occasional lazy
		Sunday. Browse my <a href="/projects/">projects</a>, read my <a href="/writings/">writings</a>,
		or
		<a href="/contact/">get in touch</a>.
	</p>
</article>

<style>
	article {
		h1 {
			margin-bottom: var(--size-4);
		}

		.intro {
			font-size: var(--font-size-fluid-1);
			color: var(--text-2);
		}

		h2 {
			margin-top: var(--size-7);
		}

		.latest-posts {
			display: grid;
			gap: var(--size-4);
			margin-top: var(--size-4);

			li {
				display: grid;
				gap: var(--size-1);
			}

			.title {
				font-size: var(--font-size-1);
				font-weight: var(--font-weight-6);
			}

			time {
				font-size: var(--font-size-0);
				color: var(--text-2);
			}
		}

		.all-writings {
			display: inline-block;
			margin-top: var(--size-5);
		}
	}
</style>
