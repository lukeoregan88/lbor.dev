import { estimateTokens, markdownPathFor, prefersMarkdown } from './negotiate.js'

// Wraps the SvelteKit Cloudflare worker (`app`) so `Accept: text/markdown` is answered with
// the Markdown twin generated at build time (scripts/build-markdown.mjs). Everything else,
// browsers included, passes straight through to the normal HTML response.
export function createWorker(app) {
	return {
		async fetch(request, env, ctx) {
			const url = new URL(request.url)
			const isRead = request.method === 'GET' || request.method === 'HEAD'
			const mdPath = isRead ? markdownPathFor(url.pathname) : null

			if (mdPath && prefersMarkdown(request.headers.get('accept'))) {
				const asset = await env.ASSETS.fetch(new Request(new URL(mdPath, url), { method: 'GET' }))
				if (asset.ok) {
					const body = await asset.text()
					const headers = new Headers(asset.headers)
					headers.set('content-type', 'text/markdown; charset=utf-8')
					headers.set('vary', 'Accept')
					headers.set('x-markdown-tokens', String(estimateTokens(body)))
					headers.delete('content-length')
					headers.delete('etag')
					return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers })
				}
			}

			const response = await app.fetch(request, env, ctx)
			if (!mdPath) return response
			// Same URL now has two representations, so caches must key on Accept.
			const varied = new Response(response.body, response)
			varied.headers.append('vary', 'Accept')
			return varied
		}
	}
}
