import { dev } from '$app/environment'
import * as config from './config'

export interface SEOProps {
	title?: string
	description?: string
	image?: string
	url?: string
	type?: 'website' | 'article'
	publishedTime?: string
	modifiedTime?: string
	author?: string
	tags?: string[]
	noindex?: boolean
}

/**
 * Generates comprehensive SEO meta tags for use in SvelteKit pages
 * Works with markdown posts and pages that have frontmatter metadata
 */
export function getSEOTags({
	title = config.title,
	description = config.description,
	image = `${config.url}/favicon.png`,
	url = '',
	type = 'website',
	publishedTime,
	modifiedTime,
	author = 'Luke O\'Regan',
	tags = [],
	noindex = false
}: SEOProps = {}) {
	const canonicalUrl = url ? `${config.url}${url}` : config.url
	const fullTitle = title === config.title ? title : `${title} | ${config.title}`

	return {
		title: fullTitle,
		description,
		canonicalUrl,
		robots: noindex ? 'noindex, follow' : 'index, follow',
		openGraph: {
			type,
			url: canonicalUrl,
			title: fullTitle,
			description,
			image,
			siteName: config.title,
			...(type === 'article' && {
				publishedTime,
				modifiedTime,
				author,
				tags
			})
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description,
			image
		},
		author,
		themeColor: '#000000'
	}
}

/**
 * Helper to extract SEO data from markdown frontmatter
 * Works with both posts and pages
 */
export function getSEOFromMetadata(metadata: {
	title?: string
	description?: string
	date?: string
	categories?: string[]
	slug?: string
	[key: string]: unknown
}, urlPath = ''): SEOProps {
	const props: SEOProps = {
		url: urlPath || (metadata.slug ? `/${metadata.slug}` : ''),
		type: metadata.categories ? 'article' : 'website',
		tags: metadata.categories || []
	}

	// Only include properties that have actual values (not empty strings or undefined)
	if (metadata.title && metadata.title.trim()) {
		props.title = metadata.title.trim()
	}
	if (metadata.description && metadata.description.trim()) {
		props.description = metadata.description.trim()
	}
	if (metadata.date) {
		try {
			props.publishedTime = new Date(metadata.date).toISOString()
		} catch {
			// Invalid date, skip
		}
	}

	return props
}

