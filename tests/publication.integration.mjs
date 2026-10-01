import assert from 'node:assert/strict'
import test from 'node:test'
import { writeFile, readFile, unlink, access } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { createServer } from 'vite'

// Fixtures are synthetic and removed even when a regression fails. Run separately
// from the fast SSR tests because this exercises a real production build.
test('dev previews drafts; production loader, sitemap and RSS exclude them', async () => {
	const draft = 'seo-regression-draft'
	const published = 'seo-regression-published'
	const fixtures = [draft, published].map((slug) => `src/posts/${slug}.md`)
	let dev
	const created = []
	try {
		for (let i = 0; i < fixtures.length; i++) {
			await writeFile(
				fixtures[i],
				`---\ntitle: SEO regression fixture\ndescription: Synthetic test content\ndate: '2026-09-01'\nupdated: '2026-09-02'\ncategories: []\npublished: ${i === 1}\n---\n\nSynthetic fixture.\n`,
				{ flag: 'wx' }
			)
			created.push(fixtures[i])
		}
		dev = await createServer({ server: { host: '127.0.0.1', port: 0 } })
		await dev.listen()
		const base = `http://127.0.0.1:${dev.httpServer.address().port}`
		const preview = await fetch(`${base}/${draft}/`)
		assert.equal(preview.status, 200)
		assert.match(await preview.text(), /Synthetic fixture/)
		const articleResponse = await fetch(`${base}/custom-wordpress-importer-vs-plugin/`)
		assert.equal(articleResponse.status, 200)
		const articleHtml = await articleResponse.text()
		assert.match(articleHtml, /<title>WordPress Feed Importer: Custom Code or Plugin\?<\/title>/)
		const articleSchemas = [
			...articleHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
		].map((match) => JSON.parse(match[1]))
		assert.equal(articleSchemas[0]['@type'], 'Article')
		assert.equal(
			articleSchemas[0].url,
			'http://localhost:5173/custom-wordpress-importer-vs-plugin/'
		)
		for (const path of ['/sitemap.xml', '/rss.xml']) {
			const response = await fetch(base + path)
			assert.equal(response.status, 200)
			const text = await response.text()
			assert.equal(text.includes(draft), false)
			assert.equal(text.includes(published), true)
		}
		await dev.close()
		dev = undefined
		execFileSync('npm', ['run', 'build'], {
			stdio: 'inherit',
			env: { ...process.env, NODE_ENV: 'production' }
		})
		const { load } = await import('../.svelte-kit/output/server/entries/pages/_slug_/_page.ts.js')
		await assert.rejects(load({ params: { slug: draft } }), (error) => error.status === 404)
		assert.equal((await load({ params: { slug: published } })).meta.published, true)
		await assert.rejects(access(`.svelte-kit/output/prerendered/pages/${draft}/index.html`))
		const fixtureHtml = await readFile(
			`.svelte-kit/output/prerendered/pages/${published}/index.html`,
			'utf8'
		)
		assert.match(fixtureHtml, /article:modified_time" content="2026-09-02T00:00:00.000Z"/)
		assert.match(fixtureHtml, /Updated[\s\S]*?<time datetime="2026-09-02T00:00:00.000Z"/)
		const jsonLd = [
			...fixtureHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
		].map((match) => JSON.parse(match[1]))
		assert.equal(jsonLd[0].dateModified, '2026-09-02T00:00:00.000Z')
		const sitemap = await readFile('.svelte-kit/output/prerendered/pages/sitemap.xml', 'utf8')
		const rss = await readFile('.svelte-kit/output/prerendered/pages/rss.xml', 'utf8')
		for (const text of [sitemap, rss]) {
			assert.equal(text.includes(draft), false)
			assert.equal(text.includes(published), true)
		}
		assert.match(
			sitemap,
			/seo-regression-published\/[\s\S]*?<lastmod>2026-09-02T00:00:00.000Z<\/lastmod>/
		)
	} finally {
		await dev?.close()
		for (const path of created) await unlink(path).catch(() => {})
	}
})
