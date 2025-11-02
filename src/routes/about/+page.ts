import { error } from '@sveltejs/kit'

export async function load() {
	try {
    // @ts-expect-error - SvelteKit is not aware of the metadata property
		const about = await import('../../pages/about.md')

		return {
			content: about.default,
			meta: about.metadata
		}
	} catch {
		error(404, 'Could not find about page')
	}
}
