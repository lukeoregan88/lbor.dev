import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath } from 'url'

import { mdsvex, escapeSvelte } from 'mdsvex'
import { createHighlighter } from 'shiki'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function rehypeExternalLinks() {
	return (tree) => {
		function visit(node) {
			if (node.type === 'element' && node.tagName === 'a') {
				const href = node.properties?.href
				if (typeof href === 'string') {
					try {
						const url = new URL(href, 'https://lbor.dev')
						if (
							(url.protocol === 'http:' || url.protocol === 'https:') &&
							url.hostname !== 'lbor.dev' &&
							url.hostname !== 'www.lbor.dev'
						) {
							node.properties.target = '_blank'
							const rel = Array.isArray(node.properties.rel)
								? node.properties.rel
								: typeof node.properties.rel === 'string'
									? node.properties.rel.split(/\s+/)
									: []
							node.properties.rel = [...new Set([...rel, 'noopener', 'noreferrer'])]
						}
					} catch {
						// Leave malformed or non-web links unchanged.
					}
				}
			}
			for (const child of node.children ?? []) visit(child)
		}
		visit(tree)
	}
}

// Global singleton Shiki highlighter instance (shared across module reloads in same process)
const SHIKI_HIGHLIGHTER_KEY = '__shiki_highlighter__'

async function getHighlighter() {
	// Use globalThis to persist across module reloads
	if (!globalThis[SHIKI_HIGHLIGHTER_KEY]) {
		globalThis[SHIKI_HIGHLIGHTER_KEY] = (async () => {
			const highlighter = await createHighlighter({
				themes: ['poimandres'],
				langs: ['javascript', 'typescript', 'php']
			})
			await highlighter.loadLanguage('javascript', 'typescript', 'php')
			return highlighter
		})()
	}
	return globalThis[SHIKI_HIGHLIGHTER_KEY]
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: __dirname + 'src/mdsvex.svelte'
	},
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getHighlighter()
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'poimandres' }))
			return `{@html \`${html}\` }`
		}
	},
	remarkPlugins: [[remarkToc, { tight: true }]],
	rehypePlugins: [rehypeSlug, rehypeExternalLinks]
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter()
	}
}

export default config
