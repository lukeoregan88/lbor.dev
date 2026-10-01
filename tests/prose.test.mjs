import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

test('prose unordered lists have paragraph spacing without changing list markers', async () => {
	const css = await readFile('src/app.css', 'utf8')
	const prose = css.slice(css.indexOf('.prose {'))
	assert.match(prose, /ul\s*\{[^}]*list-style-type:\s*disc;[^}]*margin-bottom:\s*var\(--size-7\);/)
	assert.match(prose, /ol\s*\{[^}]*list-style-type:\s*decimal;/)
	assert.equal(
		css.slice(0, css.indexOf('.prose {')).includes('margin-bottom: var(--size-7)'),
		false
	)
})
