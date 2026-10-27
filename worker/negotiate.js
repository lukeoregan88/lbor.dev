// Content negotiation helpers for the Worker entry (kept dependency-free so they can be unit tested).

// True when the client asks for text/markdown at least as strongly as HTML.
// Browsers send text/html and never text/markdown, so they keep getting HTML.
export function prefersMarkdown(accept) {
	if (!accept) return false
	const quality = { markdown: 0, html: 0, wildcard: 0 }
	for (const part of accept.split(',')) {
		const [rawType, ...params] = part.trim().toLowerCase().split(';')
		const type = rawType.trim()
		const q = params.map((param) => param.trim()).find((param) => param.startsWith('q='))
		const value = q === undefined ? 1 : Number.parseFloat(q.slice(2))
		const weight = Number.isFinite(value) ? value : 0
		if (type === 'text/markdown') quality.markdown = Math.max(quality.markdown, weight)
		else if (type === 'text/html') quality.html = Math.max(quality.html, weight)
		else if (type === '*/*' || type === 'text/*')
			quality.wildcard = Math.max(quality.wildcard, weight)
	}
	// Markdown must be named explicitly; a bare */* keeps the HTML default.
	return quality.markdown > 0 && quality.markdown >= quality.html
}

// Prerendered pages live at /<path>/index.html, so their Markdown twin is /<path>/index.md.
export function markdownPathFor(pathname) {
	if (!pathname.endsWith('/')) return null
	return `${pathname}index.md`
}

// Explicit Markdown URLs: /<path>.md serves the twin of /<path>/ ('/index.md' is the home page).
// Paths that already name a twin (/post/index.md) and dot-segments are not mapped.
export function markdownTwinFor(pathname) {
	if (pathname === '/index.md') return '/index.md'
	const match = /^\/([a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)\.md$/.exec(pathname)
	if (!match || match[1] === 'index' || match[1].endsWith('/index')) return null
	return `/${match[1]}/index.md`
}

// Rough token estimate (about four characters per token) for the x-markdown-tokens header.
export function estimateTokens(text) {
	return Math.ceil(text.length / 4)
}
