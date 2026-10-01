/** Frontmatter accepts ISO dates or timestamps with an explicit timezone. */
export function normalizeDate(value?: string): string | undefined {
	if (
		!value ||
		!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)
	)
		return undefined
	const day = value.slice(0, 10)
	const calendar = new Date(`${day}T00:00:00Z`)
	if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== day)
		return undefined
	const date = new Date(value)
	return Number.isFinite(date.getTime()) ? date.toISOString() : undefined
}
