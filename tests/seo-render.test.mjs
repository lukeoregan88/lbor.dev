import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true } })
const { render } = await server.ssrLoadModule('svelte/server')
test.after(async () => server.close())

function schemas(head) {
	return [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
		(match) => JSON.parse(match[1])
	)
}

test('SeoHead SSR emits parseable JSON-LD and prevents script injection', async () => {
	const { default: SeoHead } = await server.ssrLoadModule('/src/lib/components/SeoHead.svelte')
	const payload = {
		'@type': 'Article',
		headline: '</script><script>alert(1)</script>&\u2028\u2029'
	}
	const { head } = render(SeoHead, { props: { jsonLd: [payload, { '@type': 'Person' }] } })
	assert.deepEqual(schemas(head), [payload, { '@type': 'Person' }])
	assert.equal(head.includes('<script>alert(1)'), false)
	assert.equal(head.includes('\\u003c'), true)
})

test('updated dates propagate through metadata, schema and semantic article SSR', async () => {
	const { getSEOFromMetadata } = await server.ssrLoadModule('/src/lib/seo.ts')
	const { getArticleSchema } = await server.ssrLoadModule('/src/lib/schema.ts')
	const { default: Article } = await server.ssrLoadModule('/src/routes/[slug]/+page.svelte')
	const { default: content } = await server.ssrLoadModule(
		'/src/posts/custom-wordpress-importer-vs-plugin.md'
	)
	const meta = {
		title: 'Example',
		description: 'Example',
		date: '2026-10-01',
		updated: '2026-10-02',
		categories: []
	}
	const seo = getSEOFromMetadata(meta)
	assert.equal(seo.modifiedTime, '2026-10-02T00:00:00.000Z')
	assert.equal(getArticleSchema({ ...meta, slug: 'example' }).dateModified, seo.modifiedTime)
	const output = render(Article, {
		props: { data: { meta, slug: 'example', content, relatedPosts: [] } }
	})
	assert.match(output.body, /rel="author"/)
	assert.match(output.body, /<time datetime="2026-10-01T00:00:00.000Z"/)
	assert.match(output.body, /Updated[\s\S]*?<time datetime="2026-10-02T00:00:00.000Z"/)
	assert.match(output.head, /article:modified_time/)
	assert.equal(schemas(output.head)[0].dateModified, seo.modifiedTime)
	const uncategorized = render(Article, {
		props: {
			data: { meta: { ...meta, categories: undefined }, slug: 'example', content, relatedPosts: [] }
		}
	})
	assert.match(uncategorized.head, /og:type" content="article"/)
	assert.match(uncategorized.head, /article:modified_time/)
	const noUpdate = getArticleSchema({ ...meta, updated: undefined, slug: 'example' })
	assert.equal(noUpdate.dateModified, '2026-10-01T00:00:00.000Z')
})
