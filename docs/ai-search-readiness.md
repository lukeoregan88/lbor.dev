# Bounded AI-search readiness

## What this changes

- `/llms.txt` is a prerendered, UTF-8 plain-text Markdown navigation aid. It uses the existing site description, public navigation pages and published article titles/descriptions, rather than exposing article source or private project material.
- Article discovery reuses `getPosts()`, the same published-post pipeline used by RSS and the sitemap. The formatter also requires `published === true`, excludes the legacy `about` post and rejects slugs that are not simple lowercase hyphenated path segments.
- All navigation URLs use `productionUrl` from `src/lib/config.ts`, even during local development. Article URLs retain the site's canonical trailing slash; the text endpoint is `/llms.txt`, without a trailing slash.
- The homepage Person, WebSite author and Article author/publisher use the same `https://lbor.dev/#person` identifier and canonical author URL. Existing name, job title and profile links are unchanged.
- Existing visible article bylines link to the homepage biography. The production-output regression checks verify those links and the writings index links for every published article. No extra FAQ or biographical claims are added.

`llms.txt` is an experimental convenience, not a search ranking requirement, an indexing guarantee or a promise of AI citations. It does not grant crawler/training permissions or replace `robots.txt`, the sitemap, canonical metadata or ordinary HTML links. No robots, CDN, security or training policy is changed.

## Verification

Run from the repository with the installed Node version:

```sh
npm run check
node --experimental-strip-types --test tests/*.test.mjs
node --experimental-strip-types --test --test-force-exit tests/publication.integration.mjs
npm run build
node --experimental-strip-types --test tests/built-output.integration.mjs
git diff --check
```

The publication integration test creates fictional draft/published fixtures, verifies HTTP responses and production exclusion, and removes fixtures in `finally`. Run it separately, then rebuild before testing the clean production output. The final build must not contain the synthetic fixtures.

The HTTP development test leaves runtime resources open after its assertions complete with this Cloudflare adapter setup. `--test-force-exit` allows Node to exit after all tests finish; it does not bypass assertions. This is a test-runtime lifecycle limitation, not a production endpoint failure. An already-running development server can also cause the existing SSR test's HMR port warning; it does not invalidate the schema assertions. Do not stop unrelated development sessions to suppress that warning.

Regression coverage includes canonical production URLs, readable Markdown descriptions, plaintext MIME, draft/missing-publication/legacy/unsafe-slug exclusions, metadata escaping, stable schema identity and crawlable author/index links. Tests measure implementation correctness only. AI citation/ranking scores and query coverage are not measured by this change.

## Deployment and live checks still required

These local edits do not publish the site. After an authorised deployment, verify public HTTP 200 responses for `/llms.txt`, published article URLs, `/writings/`, `/sitemap.xml` and `/rss.xml`; check the deployed text and parsed JSON-LD, not just local build files. Confirm the actual production hosting/deployment path and authentication/access behaviour before changing anything externally. Crawler/CDN access and search indexing require separate live verification.

## Sources and limits

- [llms.txt proposal and format](https://llmstxt.org/#format): site H1, optional summary and H2 Markdown link lists. This implementation links to canonical HTML pages; it does not invent nonexistent Markdown article endpoints.
- [W3C JSON-LD node identifiers](https://www.w3.org/TR/json-ld11/#node-identifiers): `@id` identifies a node, allowing consistent identity across schema objects.
- [Google Article author markup guidance](https://developers.google.com/search/docs/appearance/structured-data/article#author-bp): author name/type and identifying URL help disambiguation. Schema remains consistent with visible authorship.
- [SvelteKit server routing](https://svelte.dev/docs/kit/routing#server): `+server.ts` GET handlers return a `Response`; this endpoint follows the site's existing prerendered feed pattern.

Existing public site copy and schema are the identity evidence for this bounded change. No separate entity-registry profile was supplied, so this is not an independent verification of professional/profile claims or cross-engine entity resolution.
