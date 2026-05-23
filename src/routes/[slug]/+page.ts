import { error } from '@sveltejs/kit'
import { getPosts, getRelatedPosts } from '$lib/posts'

export async function load({ params }) {
	let post

	try {
		post = await import(`../../posts/${params.slug}.md`)
	} catch {
		error(404, `Could not find ${params.slug}`)
	}

	const categories = (post.metadata.categories as string[] | undefined) ?? []
	const relatedPosts = getRelatedPosts(await getPosts(), params.slug, categories)

	return {
		content: post.default,
		meta: post.metadata,
		slug: params.slug,
		relatedPosts
	}
}

export async function entries() {
	const posts = await getPosts()
	return posts.map((post) => ({ slug: post.slug }))
}
