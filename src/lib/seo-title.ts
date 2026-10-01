export function getPageTitle(title: string, siteTitle: string, seoTitle?: string) {
	const customTitle = seoTitle?.trim()
	if (customTitle) return customTitle

	return title === siteTitle ? title : `${title} | ${siteTitle}`
}
