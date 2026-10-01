import * as config from '$lib/config'
import { getPosts } from '$lib/posts'
import { normalizeDate } from '$lib/dates'

export const prerender = true

const staticPages = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/writings/', changefreq: 'weekly', priority: '0.9' },
	{ path: '/contact/', changefreq: 'monthly', priority: '0.8' },
	{ path: '/projects/', changefreq: 'monthly', priority: '0.8' }
]

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
}

function urlEntry(path: string, lastmod?: string, changefreq = 'monthly', priority = '0.7') {
	const loc = `${config.url}${path}`
	const lastmodTag = lastmod ? `\n\t\t<lastmod>${lastmod}</lastmod>` : ''

	return `
\t<url>
\t\t<loc>${escapeXml(loc)}</loc>${lastmodTag}
\t\t<changefreq>${changefreq}</changefreq>
\t\t<priority>${priority}</priority>
\t</url>`
}

export async function GET() {
	const posts = await getPosts()

	const staticEntries = staticPages.map(({ path, changefreq, priority }) =>
		urlEntry(path, undefined, changefreq, priority)
	)

	const postEntries = posts.map((post) => {
		const lastmod = normalizeDate(post.updated) ?? normalizeDate(post.date)
		return urlEntry(`/${post.slug}/`, lastmod, 'monthly', '0.9')
	})

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('')}
</urlset>`

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	})
}
