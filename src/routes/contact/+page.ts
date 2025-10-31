import { error } from '@sveltejs/kit'

export async function load() {
	try {
		const contact = await import('../../pages/contact.md')

		return {
			content: contact.default,
			meta: contact.metadata
		}
	} catch (e) {
		error(404, 'Could not find contact page')
	}
}
