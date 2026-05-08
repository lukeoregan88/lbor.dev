export const prerender = true

// Directory-style output (about/index.html) so /about/ works on static FTP hosts
export const trailingSlash = 'always'

export async function load({ url }) {
	return {
		url: url.pathname
	}
}
