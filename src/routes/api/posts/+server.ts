import { json } from '@sveltejs/kit'
import { getPosts } from '$lib/posts'

export async function GET() {
	const posts = await getPosts()
	return json(posts)
}
