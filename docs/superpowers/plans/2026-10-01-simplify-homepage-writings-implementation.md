# Homepage and Writings Implementation Plan

**Spec:** `docs/superpowers/specs/2026-10-01-simplify-homepage-writings-design.md`

## Goal

Make `/` a concise personal introduction and move the existing article index to `/writings/`, keeping article routes unchanged and redirecting `/about/` to the homepage.

## Approach

Keep the existing SvelteKit/Markdown architecture. Reuse the current posts API and markup on a new Writings route; replace the homepage with concise profile-grounded copy; update global navigation, legacy redirect, sitemap, and person-schema canonical URLs. No new runtime dependencies.

## Tasks

1. **Homepage and Writings route** — Move the existing listing into `src/routes/writings/+page.ts` and `+page.svelte`, loading directly from the existing `getPosts()` helper because the layout prerenders and the JSON endpoint is not prerenderable. Replace `src/routes/+page.ts` with a data-free route and write the homepage story in `src/routes/+page.svelte`. Use approved GitHub profile facts without inventing claims. Run `npm run check`.
2. **Navigation and canonical routes** — Update `src/routes/header.svelte` and `src/lib/components/PageLinks.svelte` with Home/Writings/Projects/Contact; update the single stale client-inquiry link in `src/pages/projects.md` to target Contact; make `src/routes/about/+page.ts` throw SvelteKit's permanent 308 redirect to `/`; add `/writings/` and remove `/about/` from `src/routes/sitemap.xml/+server.ts`; update person URLs in `src/lib/schema.ts` to `/`. Replace prerendered feed fetches in `src/routes/sitemap.xml/+server.ts` and `src/routes/rss.xml/+server.ts` with direct `getPosts()` calls after the build exposed the same non-prerenderable API dependency in both. Run `npm run check`.
3. **Acceptance verification** — Run the route smoke assertions at `/home/lukeoregan/.hermes/cache/scratch/lbor-dev-routes-smoke.py` against the local dev server; run `npm run check`, `npm run build`, and `npm audit`; confirm article slugs and public route metadata remain correct. Inspect the diff and avoid committing or pushing.

## Acceptance criteria

- `/` presents Luke's personal story, current role, concise work summary, and no article index.
- `/writings/` has a Writings heading and all current post links.
- All article slugs/URLs remain unchanged.
- `/about/` responds with a permanent redirect to `/`.
- Header links are Home, Writings, Projects, Contact; sitemap includes Writings and omits About.
- Person schema uses the homepage as Luke's canonical URL.
- Type/check, production build, and npm audit succeed.
