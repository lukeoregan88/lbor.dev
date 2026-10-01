import type { Post } from '$lib/types'

export async function getPosts() {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/posts/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const post = { ...metadata, slug } satisfies Post
			if (post.published === true && slug !== 'about') {
				posts.push(post)
			}
		}
	}

	return posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	)
}

export function getRelatedPosts(posts: Post[], slug: string, categories: string[] = [], limit = 3) {
	return posts
		.filter((post) => post.slug !== slug)
		.map((post) => ({
			post,
			score: (post.categories ?? []).filter((category) => categories.includes(category)).length
		}))
		.filter(({ score }) => score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score
			return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
		})
		.slice(0, limit)
		.map(({ post }) => post)
}
