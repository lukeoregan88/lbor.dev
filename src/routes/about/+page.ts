import { error } from '@sveltejs/kit'

export async function load() {
	try {
		const about = await import('../../pages/about.md')

		return {
			content: about.default,
			meta: about.metadata
		}
	} catch (e) {
		error(404, 'Could not find about page')
	}
}
