/** JSON for a raw-text script element, never HTML-escape JSON quotes. */
function serializeJsonLd(schema: Record<string, unknown>) {
	return JSON.stringify(schema)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029')
}

/** Keep the raw-text element in one helper for Svelte and ESLint parsers. */
export function getJsonLdScript(schema: Record<string, unknown>) {
	return `<script type="application/ld+json">${serializeJsonLd(schema)}</script>`
}
