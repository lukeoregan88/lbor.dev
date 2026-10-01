import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false } })
test.after(async () => server.close())

const links = (text) => [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1])

test('llms endpoint is plain Markdown with canonical published navigation even in dev', async () => {
	const { GET } = await server.ssrLoadModule('/src/routes/llms.txt/+server.ts')
	const response = await GET()
	assert.equal(response.status, 200)
	assert.match(response.headers.get('content-type'), /^text\/plain; charset=utf-8$/)
	const text = await response.text()
	assert.match(text, /^# Luke O'Regan - LBOR\n/)
	assert.match(text, /experimental navigation aid/i)
	assert.doesNotMatch(text, /<[^>]+>|localhost|127\.0\.0\.1/)
	const { getPosts } = await server.ssrLoadModule('/src/lib/posts.ts')
	const posts = await getPosts()
	const urls = links(text)
	assert.ok(urls.length > posts.length)
	assert.equal(new Set(urls).size, urls.length)
	for (const url of urls) assert.equal(new URL(url).origin, 'https://lbor.dev')
	for (const post of posts) {
		assert.ok(urls.includes(`https://lbor.dev/${post.slug}/`))
		assert.ok(text.replace(/\\([\\`*_{}\[\]()#!|<>])/g, '$1').includes(post.description))
	}
	assert.equal(urls.includes('https://lbor.dev/about/'), false)
})

test('Person, WebSite author and Article author/publisher share the canonical identity', async () => {
	const { getPersonSchema, getWebsiteSchema, getArticleSchema } =
		await server.ssrLoadModule('/src/lib/schema.ts')
	const person = getPersonSchema()
	assert.equal(person['@id'], 'https://lbor.dev/#person')
	assert.equal(person.url, 'https://lbor.dev/')
	const article = getArticleSchema({
		title: 'Example',
		description: 'Example',
		slug: 'example',
		date: '2026-10-01'
	})
	for (const identity of [getWebsiteSchema().author, article.author, article.publisher]) {
		assert.equal(identity['@id'], person['@id'])
		assert.equal(identity['@type'], 'Person')
		assert.equal(identity.name, person.name)
		assert.equal(identity.url, person.url)
	}
})

test('llms generation excludes drafts, legacy biography and noncanonical slugs', async () => {
	const { getLlmsText } = await server.ssrLoadModule('/src/lib/llms.ts')
	const post = {
		title: 'Example',
		description: 'Readable description',
		slug: 'example',
		date: '2026-10-01',
		categories: [],
		published: true
	}
	const text = getLlmsText([
		post,
		{ ...post, slug: 'draft', published: false },
		{ ...post, slug: 'missing-publication', published: undefined },
		{ ...post, slug: 'about' },
		{ ...post, slug: '../private' },
		{ ...post, slug: 'https://other.example' }
	])
	assert.ok(links(text).includes('https://lbor.dev/example/'))
	for (const excluded of ['draft', 'missing-publication', 'about', 'private', 'other.example']) {
		assert.equal(text.includes(excluded), false)
	}
})

test('llms metadata stays single-line text rather than injecting markup or links', async () => {
	const { getLlmsText } = await server.ssrLoadModule('/src/lib/llms.ts')
	const text = getLlmsText([
		{
			title: 'Title [brackets]',
			description: '<b>Readable</b>\n[extra](https://other.example) description',
			slug: 'example',
			date: '2026-10-01',
			categories: [],
			published: true
		}
	])
	assert.doesNotMatch(text, /<[^>]+>/)
	assert.equal(links(text).includes('https://other.example'), false)
	assert.match(text, /Readable.*description/)
	assert.equal(text.split('\n').filter((line) => line.startsWith('- [Title')).length, 1)
})
