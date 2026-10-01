# Local SEO implementation report

Branch: `feat/custom-wordpress-importer-article`. No commit, push, merge or deployment.

## Outcomes

- JSON-LD now serializes into actual script content. The shared helper escapes `<`, `>`, `&`, U+2028 and U+2029, preventing script termination/injection while preserving parseable JSON. Regression tests render the actual Svelte SSR components and round-trip a hostile payload.
- The importer article now has a comparison table, eight consecutive clickable source references, and explicit concurrency, editorial-overwrite and identifier-collision caveats. Its fictional PHP example remains educational, not production-ready; no client identities or private source were introduced.
- Articles show Luke O'Regan's linked author byline and semantic publication dates. Optional ISO `updated` frontmatter drives visible Updated dates, `article:modified_time`, schema `dateModified` and sitemap `lastmod`. Schema/sitemap fall back to the publication date when no valid update exists. No historical update dates were invented.
- Shared date normalization rejects invalid/ambiguous values and converts ISO dates/timezone-qualified timestamps to UTC ISO strings. The legacy comments article date is now `2023-04-18`.
- Production article loading requires literal `published: true`; development still previews drafts. Listings, RSS and sitemap only include published posts. Article Open Graph type is correct even without categories.
- Four older articles have short explicit SEO titles; existing custom-title support and title tests were retained.
- RSS discovery and response Content-Type use `application/rss+xml`.
- `.prose ul` now has `margin-bottom: var(--size-7)`; disc bullets and ordered decimal markers remain. Navigation/global lists are unchanged.

## Verification

| Command                                                                     | Result                                                               |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `npm run check`                                                             | PASS: 0 errors, 0 warnings                                           |
| `node --experimental-strip-types --test tests/*.test.mjs`                   | PASS: 6 tests                                                        |
| `node --test --test-force-exit tests/publication.integration.mjs`           | PASS: 1 integration test                                             |
| `npm run build`                                                             | PASS: Cloudflare adapter completed                                   |
| `node --experimental-strip-types --test tests/built-output.integration.mjs` | PASS: 2 tests                                                        |
| `git diff --check`                                                          | PASS                                                                 |
| `npm run lint`                                                              | FAIL: Prettier flags 11 files; ESLint is not reached by this command |
| `npx eslint .`                                                              | FAIL: 5 errors, detailed below                                       |

Publication integration uses temporary synthetic draft/published fixtures, verifies dev HTTP 200 for draft and real importer article, parses real HTTP JSON-LD, checks dev sitemap/RSS exclusion, builds with explicit `NODE_ENV=production`, then executes the built production loader (draft 404, published accepted). It verifies no draft prerendered HTML and checks modified dates in built HTML/schema/sitemap. Fixtures are removed in `finally`. A separate final build removes fixture artifacts from generated output.

The final production-output tests verify all five real article titles (each no longer than 60 characters), author links, semantic dates, article/breadcrumb JSON, production canonical URLs, all eight clickable citations, table/caveats, homepage WebSite/Person JSON, sitemap dates and five RSS items. Production CSS was verified as `.prose ul{margin-bottom:var(--size-7);list-style-type:disc}` and `.prose ol{list-style-type:decimal}`.

## Changed paths

- `src/app.css` (retained existing standard-list work; added scoped spacing)
- `src/app.html`
- `src/lib/components/SeoHead.svelte`
- `src/lib/posts.ts`
- `src/lib/schema.ts`
- `src/lib/seo.ts` (retained existing custom-title work)
- `src/lib/types.ts`
- `src/posts/building-a-uk-weather-platform-with-sveltekit.md`
- `src/posts/custom-wordpress-importer-vs-plugin.md` (already untracked at task start)
- `src/posts/hostinger-review-2026.md`
- `src/posts/how-to-disable-html-in-wordpress-comments-without-a-plugin.md`
- `src/posts/raycast-the-2025-productivity-launcher.md`
- `src/routes/[slug]/+page.svelte`
- `src/routes/[slug]/+page.ts`
- `src/routes/rss.xml/+server.ts`
- `src/routes/sitemap.xml/+server.ts`

Created:

- `src/lib/dates.ts`
- `src/lib/json-ld.ts`
- `tests/dates.test.mjs`
- `tests/prose.test.mjs`
- `tests/seo-render.test.mjs`
- `tests/publication.integration.mjs`
- `tests/built-output.integration.mjs`
- `SEO-IMPLEMENTATION-REPORT.md`

Existing untracked `src/lib/seo-title.ts` and `tests/seo-title.test.mjs` were preserved unchanged.

## Findings and remaining boundaries

- Full lint is not clean. Formatting failures: `audit.md`, `README.md`, `src/pages/about.md`, the four older post files, `src/routes/contact/+page.ts`, `src/routes/footer.svelte`, `src/routes/projects/+page.ts`, `svelte.config.js`. Broad unrelated reformatting was deliberately avoided.
- Standalone ESLint errors: explicit `any` in `src/app.d.ts`; existing rest-props/custom-element compiler warning in `SeoHead.svelte`; existing `prefer-const` in `src/lib/posts.ts`; read-only import and custom-element props warning in `src/mdsvex.svelte`. The SeoHead warning was reproduced on the HEAD version via `git show HEAD:src/lib/components/SeoHead.svelte | npx eslint --stdin --stdin-filename src/lib/components/SeoHead.svelte`.
- An initial inline raw-script template confused the ESLint parser; script construction was moved into the helper. Only the safe JSON-LD `@html` line has a documented, narrow `svelte/no-at-html-tags` suppression.
- Vite dev initialization sets `NODE_ENV=development` in the test process. The integration build explicitly sets production to avoid testing a development-mode build accidentally. Vite/Cloudflare leaves a test-process handle after shutdown; `--test-force-exit` lets Node exit after its completed tests and fixture cleanup. An initial harness run timed out; the final documented command passes.
- The draft routing gate is not a confidentiality boundary: glob/dynamic imports can still bundle draft source. Never store confidential content in `src/posts`.
- HTTP/SSR/generated CSS were verified, not browser visual appearance. Deployment, live crawling and external indexing remain with the parent/user.
