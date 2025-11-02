import { error } from '@sveltejs/kit'

export async function load() {
	try {
    // @ts-expect-error - SvelteKit is not aware of the metadata property
		const contact = await import('../../pages/contact.md')

		return {
			content: contact.default,
			meta: contact.metadata
		}
	} catch {
		error(404, 'Could not find contact page')
	}
}
