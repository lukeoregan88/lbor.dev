# SEO Audit: lbor.dev

Date: 2026-05-23

## Executive Summary

Overall health: fair, but there are a few important SEO fundamentals to tighten up before the site is in good shape for organic growth.

### Top priorities
1. Add an XML sitemap and reference it in robots.txt.
2. Fix or redirect legacy URLs that currently 404.
3. Improve the homepage title, meta description, and add a homepage H1.
4. Add structured data (JSON-LD).
5. Replace the thin /projects/ directory listing with a proper page or noindex it.

---

## What’s working well

- Individual article pages have unique titles, H1s, meta descriptions, and canonical tags.
- Pages are indexable and served over HTTPS.
- The site has a clean, simple navigation structure.
- The content pages I checked are readable and reasonably well-structured.

---

## Technical SEO Findings

### 1) Missing XML sitemap
**Issue:** `/sitemap.xml` returns 404, and common sitemap variants also return 404.

**Impact:** High

**Evidence:** Direct requests to:
- `https://lbor.dev/sitemap.xml`
- `https://lbor.dev/sitemap_index.xml`
- `https://lbor.dev/sitemap-index.xml`
- `https://lbor.dev/wp-sitemap.xml`
all returned 404.

**Fix:**
- Generate a sitemap.
- Serve it at `/sitemap.xml`.
- Add a `Sitemap:` line in robots.txt.
- Submit it in Google Search Console.

**Priority:** 1

---

### 2) Legacy URLs now return 404
**Issue:** Some URLs that appear to have been indexed previously now return 404.

**Impact:** High

**Evidence:** Live checks showed these URLs returning 404:
- `/tools/`
- `/links/`
- `/blog/`

These URLs also still appeared in search results.

**Fix:**
- 301 redirect them to the closest relevant page, or
- restore the content if they are meant to exist, or
- return a clean 410 if they are intentionally retired.

**Priority:** 1

---

### 3) robots.txt is not a standard crawl-control file
**Issue:** `/robots.txt` currently serves a content-signal policy document and does not advertise a sitemap.

**Impact:** Medium

**Evidence:** The live robots file contains only content-signal text.

**Fix:**
If intentional, keep the content-signal policy, but also add standard crawl directives and a sitemap reference, for example:

```text
User-agent: *
Allow: /

Sitemap: https://lbor.dev/sitemap.xml
```

**Priority:** 2

---

### 4) /projects/ is a thin directory listing
**Issue:** `/projects/` does not look like a proper content page.

**Impact:** Medium

**Evidence:** The page content is essentially a directory listing with no meaningful description.

**Fix:**
- Replace it with a real projects landing page, or
- noindex it if it is only a utility path.

**Priority:** 2

---

## On-Page SEO Findings

### 1) Homepage title and meta description are too generic
**Issue:** The homepage title is generic and the description is very short.

**Impact:** High

**Evidence:**
- Title: `Luke O'Regan - LBOR`
- Description: `Developer & Digital Strategist`

**Fix:**
Make the homepage title and description more descriptive and keyword-led.

Suggested example:
- Title: `Luke O'Regan | UK Full-Stack Developer & Digital Strategist`
- Description: `Full-stack developer and digital strategist in the UK. I write about SvelteKit, WordPress, web performance, hosting, SEO, and practical build notes.`

**Priority:** 1

---

### 2) Homepage has no H1
**Issue:** The homepage does not have an H1 element.

**Impact:** High

**Evidence:** DOM inspection found 0 H1s on the homepage.

**Fix:**
Add one clear H1 that defines the page topic.

Example:
`Luke O'Regan — UK Full-Stack Developer & Digital Strategist`

**Priority:** 1

---

### 3) No structured data found
**Issue:** I did not find any JSON-LD structured data on the pages checked.

**Impact:** Medium

**Evidence:** DOM inspection found 0 JSON-LD blocks.

**Fix:**
Add schema markup such as:
- `Person` or `Organization`
- `WebSite`
- `Article` on blog posts
- `BreadcrumbList` where relevant

**Priority:** 2

---

### 4) Social preview image is weak
**Issue:** The site appears to use a favicon as the Open Graph image.

**Impact:** Low to Medium

**Evidence:** Article page meta tags point `og:image` to `favicon.png`.

**Fix:**
Create proper social preview images for the homepage and article templates.

**Priority:** 3

---

## Content / Information Architecture Findings

### 1) Site topics are broad
**Issue:** The site covers several different themes: SvelteKit, WordPress, hosting, productivity, SEO, and general developer content.

**Impact:** Medium

**Fix:**
Create clearer topic clusters so the site builds stronger topical authority.

Suggested clusters:
- SvelteKit / modern frontend
- WordPress / CMS
- Hosting / performance
- SEO / digital strategy

**Priority:** 3

---

### 2) Internal linking could be more deliberate
**Issue:** There is room to improve contextual internal linking between related articles and core pages.

**Impact:** Medium

**Fix:**
- Add related posts sections
- Link blog posts to relevant About / Projects / Contact pages
- Link between related articles within the same topic cluster

**Priority:** 3

---

## Recommended Action Plan

### Critical fixes
1. Create and submit an XML sitemap.
2. Fix or redirect legacy 404 URLs.
3. Improve homepage title, meta description, and H1.

### High-impact improvements
4. Add structured data.
5. Turn `/projects/` into a meaningful page or noindex it.

### Quick wins
6. Use proper Open Graph images.
7. Add more internal links between related pages.
8. Make canonical and trailing-slash handling consistent everywhere.

### Longer-term work
9. Build stronger content clusters around your core topics.
10. Expand the site into a more clearly structured portfolio / content hub.