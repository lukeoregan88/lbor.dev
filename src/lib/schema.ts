import * as config from './config'
import { normalizeDate } from './dates'

type BreadcrumbItem = {
	name: string
	path: string
}

function absoluteUrl(path = '/') {
	const normalised = path.startsWith('/') ? path : `/${path}`
	return `${config.url}${normalised}`
}

// Stable entity identifier, including in previews: https://www.w3.org/TR/json-ld11/#node-identifiers
function getPersonIdentity() {
	return {
		'@type': 'Person',
		'@id': `${config.productionUrl}/#person`,
		name: "Luke O'Regan",
		url: `${config.productionUrl}/`
	}
}

export function getPersonSchema() {
	return {
		'@context': 'https://schema.org',
		...getPersonIdentity(),
		jobTitle: 'Senior Full-Stack Developer & Digital Strategist',
		sameAs: [
			'https://www.linkedin.com/in/lukeoregan/',
			'https://github.com/lukeoregan88/',
			'https://x.com/lukeoregan88'
		]
	}
}

export function getWebsiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: config.siteName,
		url: absoluteUrl('/'),
		description: config.description,
		author: getPersonIdentity()
	}
}

export function getArticleSchema({
	title,
	description,
	slug,
	date,
	updated,
	categories = []
}: {
	title: string
	description: string
	slug: string
	date: string
	updated?: string
	categories?: string[]
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description,
		url: absoluteUrl(`/${slug}/`),
		datePublished: normalizeDate(date),
		dateModified: normalizeDate(updated) ?? normalizeDate(date),
		author: getPersonIdentity(),
		publisher: getPersonIdentity(),
		mainEntityOfPage: absoluteUrl(`/${slug}/`),
		image: absoluteUrl('/og-image-wide.png'),
		...(categories.length > 0 && { keywords: categories.join(', ') })
	}
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	}
}
