import * as config from './config'

type BreadcrumbItem = {
	name: string
	path: string
}

function absoluteUrl(path = '/') {
	const normalised = path.startsWith('/') ? path : `/${path}`
	return `${config.url}${normalised}`
}

export function getPersonSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Luke O\'Regan',
		url: absoluteUrl('/about/'),
		jobTitle: 'Full-Stack Developer & Digital Strategist',
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
		author: {
			'@type': 'Person',
			name: 'Luke O\'Regan',
			url: absoluteUrl('/about/')
		}
	}
}

export function getArticleSchema({
	title,
	description,
	slug,
	date,
	categories = []
}: {
	title: string
	description: string
	slug: string
	date: string
	categories?: string[]
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description,
		url: absoluteUrl(`/${slug}/`),
		datePublished: new Date(date).toISOString(),
		author: {
			'@type': 'Person',
			name: 'Luke O\'Regan',
			url: absoluteUrl('/about/')
		},
		publisher: {
			'@type': 'Person',
			name: 'Luke O\'Regan',
			url: absoluteUrl('/about/')
		},
		mainEntityOfPage: absoluteUrl(`/${slug}/`),
		image: absoluteUrl('/og-image.png'),
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
