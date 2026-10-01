# Homepage and Writings Reorganisation

**Status:** Implemented and verified. `npm run check`, build, route smoke tests, and `npm audit` pass; full-project lint still reports existing parser/formatting issues.
**Date:** 2026-10-01

## Goal

Make the homepage a concise personal introduction based on Luke's current GitHub profile, and give writing a dedicated destination. Reduce homepage clutter without losing existing article URLs or making old About links fail.

## Agreed experience

### Homepage (`/`)

- Replace the article feed with a short first-person introduction and professional story.
- Use the supplied GitHub profile as the current source of truth for headline and role: UK-based Senior Full-Stack Developer / Digital Strategist, with 15+ years of experience and a creative/technical background.
- Mention the current role at Direct Design Studio as the sole work-experience entry.
- Use a concise “What I do” summary for areas such as web applications, WordPress/CMS, e-commerce, and SEO/performance.
- Omit the education section, older work history, and exhaustive skills/tools lists from the homepage.
- Retain existing site design conventions and meaningful SEO/person structured data, updating homepage metadata to reflect the new purpose.

### Writings (`/writings/`)

- Move the current homepage article listing to a dedicated page headed **Writings**.
- Reuse the existing posts endpoint/data shape and article-card presentation where practical.
- Keep every article's current slug and URL unchanged.

### Navigation and old route

- Use the primary links **Home**, **Writings**, **Projects**, and **Contact**.
- Remove the redundant About navigation item because the homepage becomes the personal introduction.
- Redirect `/about/` to `/` with a permanent redirect, preserving old inbound links without duplicating the biography.

## Scope and likely files

- `src/routes/+page.svelte` and `src/routes/+page.ts`: replace the homepage feed with the personal introduction and appropriate metadata.
- `src/routes/writings/+page.svelte` and `src/routes/writings/+page.ts`: add the dedicated article index.
- `src/routes/header.svelte`: update navigation labels and links.
- `src/lib/components/PageLinks.svelte`: keep the site's secondary page links aligned with the new routes.
- `src/routes/about/+page.ts`: redirect the legacy About path to the homepage.
- `src/lib/config.ts`: update homepage metadata if needed.
- `src/routes/sitemap.xml/+server.ts`: ensure the Writings page is discoverable and the redirecting About route is not listed as a canonical page.

No article body, article slug, general project-page redesign, contact-page change, deployment setup, or remote GitHub state is in scope. The Projects page gets only one link correction: client inquiries now go directly to Contact rather than through the redirecting About URL.

## Verification

- Run `npm run check` and `npm run build`.
- Verify `/` renders the personal story, `/writings/` lists the same articles, article links still resolve, and `/about/` redirects to `/`.
- Verify the navigation links and sitemap include the intended public routes.
- Run `npm audit` to ensure the separate dependency remediation remains at zero reported vulnerabilities.
- Keep the dependency remediation logically separate from the site-content/route change.

## Decisions

- Use GitHub profile content supplied by Luke as the current source; do not invent client results, employers, dates, or achievements.
- Keep the homepage compact: a short expertise summary is sufficient; detailed tool inventories stay off the landing page.
- Preserve old `/about/` links through a redirect rather than leaving a duplicate About page.
