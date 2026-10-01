import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeDate } from '../src/lib/dates.ts'

test('normalizes ISO dates and rejects invalid or ambiguous dates', () => {
	assert.equal(normalizeDate('2026-10-01'), '2026-10-01T00:00:00.000Z')
	assert.equal(normalizeDate('2026-10-01T12:30:00+01:00'), '2026-10-01T11:30:00.000Z')
	for (const value of [
		undefined,
		'',
		'not a date',
		'2026-02-30',
		'2023-4-18',
		'2026-10-01T12:30:00'
	]) {
		assert.equal(normalizeDate(value), undefined)
	}
})
