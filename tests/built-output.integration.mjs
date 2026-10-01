import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile, readdir } from 'node:fs/promises'
import { normalizeDate } from '../src/lib/dates.ts'

const pages = '.svelte-kit/output/prerendered/pages'
const parseSchemas = (html) =>
	[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
		JSON.parse(match[1])
	)

test('clean production articles have valid schema, semantic dates and short SEO titles', async () => {
	const sitemap = await readFile(`${pages}/sitemap.xml`, 'utf8')
	const rss = await readFile(`${pages}/rss.xml`, 'utf8')
	const files = (await readdir('src/posts')).filter((file) => file.endsWith('.md'))
	let count = 0
	for (const file of files) {
		const markdown = await readFile(`src/posts/${file}`, 'utf8')
		if (!/^published: true$/m.test(markdown)) continue
		const slug = file.slice(0, -3)
		const html = await readFile(`${pages}/${slug}/index.html`, 'utf8')
		const title = markdown.match(/^seoTitle: '(.+)'$/m)?.[1]
		assert.ok(title, `${slug} has a short SEO title`)
		assert.equal(html.match(/<title>(.*?)<\/title>/)?.[1], title)
		assert.ok(title.length <= 60)
		assert.match(html, /rel="author"/)
		assert.match(html, /og:type" content="article"/)
		assert.match(html, /rel="alternate" type="application\/rss\+xml" href="\/rss.xml"/)
		const schemas = parseSchemas(html)
		assert.deepEqual(
			schemas.map((schema) => schema['@type']),
			['Article', 'BreadcrumbList']
		)
		const article = schemas[0]
		assert.equal(article.url, `https://lbor.dev/${slug}/`)
		assert.equal(article.author.name, "Luke O'Regan")
		const date = normalizeDate(markdown.match(/^date: '(.+)'$/m)?.[1])
		const updated = normalizeDate(markdown.match(/^updated: '(.+)'$/m)?.[1]) ?? date
		assert.equal(article.datePublished, date)
		assert.equal(article.dateModified, updated)
		assert.ok(html.includes(`<time datetime="${date}"`))
		const entry = sitemap.split('<url>').find((entry) => entry.includes(`/${slug}/`))
		assert.ok(entry.includes(`<lastmod>${updated}</lastmod>`))
		assert.ok(rss.includes(`https://lbor.dev/${slug}/`))
		count++
	}
	assert.equal((rss.match(/<item>/g) ?? []).length, count)
	assert.equal(sitemap.includes('seo-regression-'), false)
	assert.equal(rss.includes('seo-regression-'), false)
	const articleHtml = await readFile(
		`${pages}/custom-wordpress-importer-vs-plugin/index.html`,
		'utf8'
	)
	assert.match(articleHtml, /<table>/)
	for (let n = 1; n <= 8; n++) {
		assert.ok(articleHtml.includes(`href="#source-${n}"`))
		assert.ok(articleHtml.includes(`id="source-${n}"`))
	}
	for (const caveat of ['Concurrency:', 'Editorial overwrites:', 'Identifiers:'])
		assert.ok(articleHtml.includes(caveat))
	assert.deepEqual(
		parseSchemas(await readFile(`${pages}/index.html`, 'utf8')).map((schema) => schema['@type']),
		['WebSite', 'Person']
	)
	console.log(`Verified ${count} production articles, homepage schemas, sitemap and RSS.`)
})

test('production CSS limits unordered-list spacing to prose and preserves markers', async () => {
	const assets = '.svelte-kit/output/client/_app/immutable/assets'
	const css = (
		await Promise.all(
			(await readdir(assets))
				.filter((file) => file.endsWith('.css'))
				.map((file) => readFile(`${assets}/${file}`, 'utf8'))
		)
	).join('')
	const rule = css.match(/\.prose ul\{([^}]*)\}/)?.[1]
	assert.ok(rule?.includes('margin-bottom:var(--size-7)'))
	assert.ok(rule.includes('list-style-type:disc'))
	assert.match(css, /\.prose ol\{list-style-type:decimal\}/)
	console.log(`Verified production .prose ul: ${rule}`)
})
