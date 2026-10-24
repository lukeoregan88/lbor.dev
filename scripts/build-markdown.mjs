// Post-build step: write a Markdown twin (index.md) next to every prerendered index.html.
// The Worker in worker/index.js serves these when a client sends `Accept: text/markdown`.
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseHTML } from 'linkedom'
import TurndownService from 'turndown'

const outDir = new URL('../.svelte-kit/cloudflare/', import.meta.url).pathname
const origin = 'https://lbor.dev'

const turndown = new TurndownService({
	headingStyle: 'atx',
	codeBlockStyle: 'fenced',
	bulletListMarker: '-',
	emDelimiter: '*'
})
turndown.remove(['script', 'style', 'noscript', 'svg', 'button', 'nav', 'footer', 'iframe'])
// Shiki wraps each line in spans; textContent keeps the code and its newlines intact.
turndown.addRule('shikiCode', {
	filter: (node) => node.nodeName === 'PRE' && node.querySelector('code'),
	replacement: (_content, node) => {
		const language =
			/language-([\w-]+)/.exec(`${node.className} ${node.querySelector('code').className}`)?.[1] ??
			''
		return `\n\n\`\`\`${language}\n${node.querySelector('code').textContent.replace(/\n$/, '')}\n\`\`\`\n\n`
	}
})

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name)
		if (entry.isDirectory()) {
			if (entry.name !== '_app') yield* walk(path)
		} else if (entry.name === 'index.html') {
			yield path
		}
	}
}

const clean = (value) => (value ?? '').replace(/\s+/g, ' ').trim()
let written = 0

for await (const file of walk(outDir)) {
	const { document } = parseHTML(await readFile(file, 'utf8'))
	const main = document.querySelector('main')
	if (!main) continue

	const route = `/${file.slice(outDir.length).replace(/index\.html$/, '')}`
	const title = clean(document.querySelector('title')?.textContent)
	const description = clean(
		document.querySelector('meta[name="description"]')?.getAttribute('content')
	)
	const frontmatter = [
		'---',
		title && `title: ${JSON.stringify(title)}`,
		description && `description: ${JSON.stringify(description)}`,
		`url: ${origin}${route}`,
		'---'
	]
		.filter(Boolean)
		.join('\n')

	const body = turndown
		.turndown(main.innerHTML)
		.replace(/\n{3,}/g, '\n\n')
		.trim()
	await writeFile(join(file, '..', 'index.md'), `${frontmatter}\n\n${body}\n`)
	written += 1
}

if (written === 0)
	throw new Error('build-markdown: no pages converted; is the build output present?')
console.log(`build-markdown: wrote ${written} Markdown pages`)

// adapter-cloudflare writes the SvelteKit worker to wrangler's `main`. Move it aside and put a
// thin wrapper in its place so Markdown negotiation runs first (see worker/index.js).
const workerPath = `${outDir}_worker.js`
// Kept exactly one directory below .svelte-kit so the worker's relative imports still resolve.
const appWorkerPath = new URL('../.svelte-kit/app/worker.js', import.meta.url).pathname
await mkdir(new URL('../.svelte-kit/app/', import.meta.url), { recursive: true })
await rename(workerPath, appWorkerPath)
await writeFile(
	workerPath,
	`import app from '../app/worker.js'
import { createWorker } from '../../worker/index.js'

export default createWorker(app)
`
)
console.log('build-markdown: wrapped _worker.js with Markdown negotiation')
