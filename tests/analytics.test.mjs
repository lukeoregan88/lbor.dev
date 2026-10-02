import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const appHtml = await readFile(new URL('../src/app.html', import.meta.url), 'utf8')

test('loads Google Analytics once with the provided GA4 measurement ID', () => {
	assert.equal((appHtml.match(/googletagmanager\.com\/gtag\/js\?id=G-E7X47H0EZC/g) ?? []).length, 1)
	assert.equal((appHtml.match(/gtag\('config',\s*'G-E7X47H0EZC'\)/g) ?? []).length, 1)
})
