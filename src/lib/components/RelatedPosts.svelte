<script lang="ts">
	import type { Post } from '$lib/types'

	interface Props {
		posts: Post[]
	}

	let { posts }: Props = $props()
</script>

{#if posts.length > 0}
	<aside class="related">
		<h2>Related posts</h2>
		<ul>
			{#each posts as post}
				<li>
					<a href="/{post.slug}/">{post.title}</a>
				</li>
			{/each}
		</ul>
	</aside>
{/if}

<style>
	.related {
		margin-top: var(--size-9);
		padding-top: var(--size-7);
		border-top: 1px solid var(--border);
		max-inline-size: var(--size-content-3);

		h2 {
			margin-bottom: var(--size-4);
		}

		ul {
			display: grid;
			gap: var(--size-3);
		}

		a {
			color: inherit;
		}
	}
</style>
