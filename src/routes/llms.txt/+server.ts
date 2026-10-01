import { getLlmsText } from '$lib/llms'
import { getPosts } from '$lib/posts'

export const prerender = true
export const trailingSlash = 'never'

export async function GET() {
	return new Response(getLlmsText(await getPosts()), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	})
}
