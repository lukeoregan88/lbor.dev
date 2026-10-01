import * as config from '$lib/config'
import { getPosts } from '$lib/posts'

export const prerender = true

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
}

export async function GET() {
	const posts = await getPosts()

	const headers = { 'Content-Type': 'application/rss+xml; charset=utf-8' }

	const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>${escapeXml(config.title)}</title>
				<description>${escapeXml(config.description)}</description>
				<link>${escapeXml(config.url)}</link>
				<atom:link href="${escapeXml(`${config.url}/rss.xml`)}" rel="self" type="application/rss+xml"/>
				${posts
					.map(
						(post) => `
						<item>
							<title>${escapeXml(post.title)}</title>
							<description>${escapeXml(post.description)}</description>
							<link>${escapeXml(`${config.url}/${post.slug}/`)}</link>
							<guid isPermaLink="true">${escapeXml(`${config.url}/${post.slug}/`)}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
						</item>
					`
					)
					.join('')}
			</channel>
		</rss>
	`.trim()

	return new Response(xml, { headers })
}
