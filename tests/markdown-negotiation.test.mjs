import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { markdownPathFor, prefersMarkdown } from '../worker/negotiate.js'
import { createWorker } from '../worker/index.js'

test('browsers and bare wildcards keep HTML', () => {
	assert.equal(prefersMarkdown(undefined), false)
	assert.equal(prefersMarkdown(''), false)
	assert.equal(prefersMarkdown('*/*'), false)
	assert.equal(
		prefersMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
		false
	)
})

test('an explicit text/markdown request wins unless HTML is preferred', () => {
	assert.equal(prefersMarkdown('text/markdown'), true)
	assert.equal(prefersMarkdown('text/markdown, text/html;q=0.1'), true)
	assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false)
	assert.equal(prefersMarkdown('text/markdown;q=0'), false)
})

test('only trailing-slash page paths map to a Markdown twin', () => {
	assert.equal(markdownPathFor('/'), '/index.md')
	assert.equal(markdownPathFor('/post/'), '/post/index.md')
	assert.equal(markdownPathFor('/logo.svg'), null)
})

const app = {
	fetch: async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } })
}
const env = {
	ASSETS: {
		fetch: async (request) =>
			new URL(request.url).pathname === '/post/index.md'
				? new Response('# Post\n', { headers: { 'content-type': 'text/markdown' } })
				: new Response('missing', { status: 404 })
	}
}
const call = (path, accept, method = 'GET') =>
	createWorker(app).fetch(
		new Request(`https://lbor.dev${path}`, { method, headers: { accept } }),
		env,
		{}
	)

test('worker serves Markdown with the right headers and varies HTML on Accept', async () => {
	const md = await call('/post/', 'text/markdown')
	assert.equal(md.headers.get('content-type'), 'text/markdown; charset=utf-8')
	assert.equal(md.headers.get('vary'), 'Accept')
	assert.equal(md.headers.get('x-markdown-tokens'), '2')
	assert.equal(await md.text(), '# Post\n')
	assert.equal(
		(await call('/post/', 'text/markdown', 'HEAD')).headers.get('content-type'),
		'text/markdown; charset=utf-8'
	)

	const html = await call('/post/', 'text/html')
	assert.match(html.headers.get('content-type'), /text\/html/)
	assert.match(html.headers.get('vary'), /Accept/)
})

test('worker falls back to the app when there is no Markdown twin or the path is an asset', async () => {
	assert.match((await call('/other/', 'text/markdown')).headers.get('content-type'), /text\/html/)
	assert.match((await call('/logo.svg', 'text/markdown')).headers.get('content-type'), /text\/html/)
})

test('robots.txt declares content signals for ai-train, search and ai-input', async () => {
	const robots = await readFile(new URL('../static/robots.txt', import.meta.url), 'utf8')
	assert.match(robots, /^Content-Signal: ai-train=no, search=yes, ai-input=yes$/m)
})

test(
	'built output has Markdown twins when a build exists',
	{ skip: !existsSync(new URL('../.svelte-kit/cloudflare/index.md', import.meta.url)) },
	async () => {
		const md = await readFile(
			new URL('../.svelte-kit/cloudflare/index.md', import.meta.url),
			'utf8'
		)
		assert.match(md, /^---\ntitle: /)
		assert.doesNotMatch(md, /<script|<nav|<footer/)
	}
)

test('explicit .md URLs map to the Markdown twin', async () => {
	const { markdownTwinFor } = await import('../worker/negotiate.js')
	assert.equal(markdownTwinFor('/post.md'), '/post/index.md')
	assert.equal(markdownTwinFor('/writings.md'), '/writings/index.md')
	assert.equal(markdownTwinFor('/index.md'), '/index.md')
	assert.equal(markdownTwinFor('/post/index.md'), null)
	assert.equal(markdownTwinFor('/post/'), null)
	assert.equal(markdownTwinFor('/a/../b.md'), null)
	assert.equal(markdownTwinFor('/logo.svg'), null)
})

test('GET /post.md serves Markdown with canonical Link and noindex', async () => {
	const worker = createWorker(app)
	const res = await worker.fetch(new Request('https://lbor.dev/post.md'), env, {})
	assert.equal(res.status, 200)
	assert.match(res.headers.get('content-type'), /^text\/markdown/)
	assert.equal(res.headers.get('x-robots-tag'), 'noindex')
	assert.equal(res.headers.get('link'), '<https://lbor.dev/post/>; rel="canonical"')
	assert.equal(await res.text(), '# Post\n')
	const missing = await worker.fetch(new Request('https://lbor.dev/nope.md'), env, {})
	assert.match(missing.headers.get('content-type'), /^text\/html/)
})
