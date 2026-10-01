import * as config from './config'
import type { Post } from './types'

// Keep metadata as readable, single-line Markdown text, not HTML or additional links.
function markdownText(value: string) {
	return value
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/[\\`*_{}\[\]()#!|<>]/g, '\\$&')
}

// Experimental navigation format: https://llmstxt.org/
// This is not a crawler permission file or a ranking/citation requirement.
export function getLlmsText(posts: Post[]) {
	const published = posts.filter(
		(post) =>
			post.published === true &&
			post.slug !== 'about' &&
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)
	)

	return [
		`# ${markdownText(config.siteName)}`,
		'',
		`> ${markdownText(config.description)}`,
		'',
		'This is an experimental navigation aid to public pages. It does not grant crawler or training permissions or guarantee search rankings or AI citations.',
		'',
		'## Site',
		'',
		`- [Home and author biography](${config.productionUrl}/): Luke O'Regan's professional introduction.`,
		`- [Writings](${config.productionUrl}/writings/): All published articles.`,
		`- [Projects](${config.productionUrl}/projects/): Public project portfolio.`,
		`- [Contact](${config.productionUrl}/contact/): Contact information.`,
		'',
		'## Published articles',
		'',
		...published.map(
			(post) =>
				`- [${markdownText(post.title)}](${config.productionUrl}/${post.slug}/): ${markdownText(post.description)}`
		),
		''
	].join('\n')
}
