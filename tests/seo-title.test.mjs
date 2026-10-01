import assert from 'node:assert/strict'
import test from 'node:test'
import { getPageTitle } from '../src/lib/seo-title.ts'

test('uses a supplied SEO title without appending the site title', () => {
	assert.equal(
		getPageTitle(
			'Custom WordPress Importer vs Plugin: How to Choose',
			"Luke O'Regan | Senior Full-Stack Developer & Digital Strategist",
			'WordPress Feed Importer: Custom Code or Plugin?'
		),
		'WordPress Feed Importer: Custom Code or Plugin?'
	)
})

test('keeps the existing site-title suffix when no SEO title is supplied', () => {
	assert.equal(
		getPageTitle('A blog post', "Luke O'Regan | Senior Full-Stack Developer & Digital Strategist"),
		"A blog post | Luke O'Regan | Senior Full-Stack Developer & Digital Strategist"
	)
})
