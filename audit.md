# lbor.dev — project audit

Audited 1 October 2026 from the repository at `main` (`35951ba`) and from live responses at `https://lbor.dev`.

## Summary

[lbor.dev](https://lbor.dev) is Luke O’Regan’s personal site: a small static blog and portfolio. There is no application server, database, or CMS in production. SvelteKit prerenders every page to HTML at build time, GitHub Actions uploads the `build/` folder over FTP, and Hostinger’s LiteSpeed server serves those files. Cloudflare sits in front of the host.

The package is still named `sveltekit-markdown-blog`. The public site is branded **Luke O’Regan - LBOR**.

## How it is built

### Stack

| Layer | Choice |
| --- | --- |
| Framework | SvelteKit 2, Svelte 5 |
| Language | TypeScript (`strict`) |
| Build | Vite 5 |
| Output | `@sveltejs/adapter-static` — fully prerendered HTML |
| Content | Markdown via mdsvex (`.md` is a Svelte component extension) |
| Code highlighting | Shiki, theme `poimandres`, languages JavaScript, TypeScript, PHP |
| Markdown extras | `remark-toc`, `rehype-slug` |
| UI | Open Props (`style`, `normalize`, `buttons`), Lucide icons for the theme toggle |
| Fonts | Atkinson Hyperlegible, JetBrains Mono (`@fontsource`, bundled at build) |
| Lint / format | ESLint 9 (flat config) + Prettier (tabs, single quotes, no semicolons) |

`@sveltejs/adapter-vercel` is listed in `devDependencies` and is not used. `svelte.config.js` imports `@sveltejs/adapter-static` only.

Two lockfiles are committed: `package-lock.json` and `pnpm-lock.yaml`. `.npmrc` sets `engine-strict=true`. Continuous integration installs with `npm ci`, so npm is the lockfile that actually ships.

### Rendering model

`src/routes/+layout.ts` sets:

- `prerender = true` — the whole route tree is static. There is no Node process after deploy.
- `trailingSlash = 'always'` — routes are written as directories (`about/index.html`) so `/about/` works on a static host.

The canonical origin comes from `$app/environment`: `http://localhost:5173` in dev, `https://lbor.dev` in production (`src/lib/config.ts`). That value is baked into canonical URLs, Open Graph tags, JSON-LD, the sitemap, and the RSS feed at build time.

Unknown URLs are not handled by the SvelteKit app in production. `+error.svelte` only applies when the app itself calls `error()`. The host serves its own 404 document for anything that was not prerendered.

### Repository layout

```
src/
  app.html              document shell, theme bootstrap script
  app.css               design tokens and prose styles
  mdsvex.svelte         markdown layout (custom img component)
  posts/*.md            blog posts (published when frontmatter says so)
  pages/*.md            about, contact, projects
  lib/
    config.ts           site name, title, description, URL
    posts.ts            glob-import posts, related-post scoring
    seo.ts              meta tag model
    schema.ts           schema.org Person, WebSite, Article, BreadcrumbList
    theme.svelte.ts    colour-scheme toggle (localStorage)
    components/         SeoHead, RelatedPosts, PageLinks, custom img
  routes/
    +layout.*           shell: header, main, footer
    +page.*             home: post list
    [slug]/             one prerendered page per published post
    about|contact|projects/
    rss.xml/+server.ts
    sitemap.xml/+server.ts
    api/posts/+server.ts
static/                 favicon.svg, logo.svg, og-image.png, robots.txt, .htaccess
.github/workflows/deploy.yml
```

### Content model

Posts live in `src/posts/*.md`. `getPosts()` (`src/lib/posts.ts`) eager-imports `/src/posts/*.md`, keeps entries with `published: true`, drops a slug named `about`, and sorts newest first.

Frontmatter shape (`Post`):

- `title`, `description`, `date`, `categories`, `published`
- `slug` is the filename without `.md`, not a frontmatter field

Related posts score overlap of `categories` and return up to three matches. A post with no categories (the Raycast post) never appears as related and never receives related links.

Static pages (`src/pages/about.md`, `contact.md`, `projects.md`) are imported by their route loaders. They are not part of the post index.

There is no comment system, search, pagination, auth, or contact form. Contact is a `mailto:hello@lbor.dev` link.

### Routes

| URL | Source | What it does |
| --- | --- | --- |
| `/` | `src/routes/+page.*` | Heading plus published posts. Loads posts by fetching `/api/posts` during prerender. |
| `/about/`, `/contact/`, `/projects/` | matching route + `src/pages/*.md` | Markdown body, SEO, breadcrumbs |
| `/{slug}/` | `src/routes/[slug]/` | One HTML file per published post. `entries()` supplies the slugs. |
| `/rss.xml` | `+server.ts` | RSS 2.0, XML-escaped |
| `/sitemap.xml` | `+server.ts` | Static pages plus posts |
| `/api/posts` | `+server.ts` | JSON array of published posts. Prerendered to a static file; not a live API. |

`static/.htaccess` intends these permanent redirects:

- `/blog` → `/`
- `/tools` → `/projects/`
- `/links` → `/about/`

### Layout and client behaviour

`app.html` sets `lang="en"`, viewport, theme colour `#000000`, author, and an Open Graph site name. A small inline module script reads `localStorage['color-scheme']` and sets `color-scheme` on `<html>` before paint. If nothing is stored, it writes `dark`.

The header (`src/routes/header.svelte`) links Home, About, Contact, Projects, and a light/dark toggle (`lucide-svelte` Sun/Moon). The toggle class in `src/lib/theme.svelte.ts` uses a Svelte 5 `$state` rune. The button itself still uses the Svelte 4 `on:click` directive.

Page changes fade via `{#key url}` in `src/routes/transition.svelte`. `data-sveltekit-preload-data="hover"` is set on `<body>`, so after hydration the static site still behaves like a client-side app between prerendered pages.

Visual system: Open Props fluid type and spacing, max width 1440px, article measure `--size-content-3`, dark-first palette with a light override for `prefers-color-scheme` and for an explicit `[color-scheme]` attribute. Prose lists use a fire emoji as the marker.

### SEO and feeds

`SeoHead.svelte` writes title, description, robots, canonical, Open Graph, Twitter card, and JSON-LD. Default image is `/og-image.png` (about 1.2 MB). Article pages add `article:published_time` and `article:tag`. `modifiedTime` exists on the SEO type and is not populated.

JSON-LD:

- Home: `WebSite` + `Person`
- About: `Person` + breadcrumbs
- Contact and Projects: breadcrumbs
- Posts: `Article` + breadcrumbs

`Person.sameAs`: LinkedIn, GitHub (`lukeoregan88`), X (`lukeoregan88`). The footer also links Telegram (`t.me/lukeoregan88`). Telegram is not in the schema.

`robots.txt` allows all crawlers and points at `https://lbor.dev/sitemap.xml`. The rest of the file is a comment block about EU content-signal reservations (search / ai-input / ai-train). It does not set `Content-Signal` directives.

The document head advertises the feed as `application/atom+xml`. The file is RSS 2.0.

`static/favicon.svg` exists. Nothing in `app.html` links it.

### Published content

Posts, newest first:

| Slug | Date | Categories |
| --- | --- | --- |
| `building-a-uk-weather-platform-with-sveltekit` | 2025-11-02 | sveltekit, weather, javascript, typescript |
| `hostinger-review-2026` | 2025-11-02 | hosting, review, hostinger |
| `raycast-the-2025-productivity-launcher` | 2025-11-01 | none |
| `how-to-disable-html-in-wordpress-comments-without-a-plugin` | 2023-04-18 | wordpress, php |

Projects page links out to:

- `https://projects.lbor.dev/dns-checker/`
- `https://projects.lbor.dev/uk-weather-analytics-dashboard/`
- The weather post also cites `https://github.com/lukeoregan88/UK-Weather-Analytics-Dashboard` and a GitHub Pages demo.

### Local commands

```sh
npm run dev       # vite dev
npm run build     # vite build → ./build
npm run preview   # vite preview
npm run check     # svelte-kit sync && svelte-check
npm run lint      # prettier --check && eslint
npm run format    # prettier --write
```

Node on this machine at audit time: v22.22.3. CI uses Node 22.

There is no test suite, no preview environment, and no `.env` consumed by the app. `.gitignore` ignores `.env`, `.env.*` (except `.env.example`, which is not in the repo), `build/`, and `.svelte-kit/`.

## How it is running

### Pipeline

1. Push to `main` on `https://github.com/lukeoregan88/lbor.dev.git`.
2. GitHub Actions workflow `.github/workflows/deploy.yml` (`Build and Deploy`):
   - `actions/checkout@v6`
   - `actions/setup-node@v6` with Node 22 and npm cache
   - `npm ci`
   - `npm run build`
   - `SamKirkland/FTP-Deploy-Action@v4.4.0`
3. FTP secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.
4. Local directory `./build/` is uploaded to remote `/homepage_root/`.
5. Excludes: git metadata, `node_modules`, `.DS_Store`.

The workflow does not run `npm run check` or `npm run lint`. A push to `main` is the only trigger. There is no staging branch.

Footer copyright uses `new Date().getFullYear()` inside a prerendered component, so the year is fixed at build time until the next deploy.

### Production host

Checked with response headers on 1 October 2026:

| Signal | Value |
| --- | --- |
| Public URL | `https://lbor.dev` |
| DNS | Cloudflare nameservers `melina.ns.cloudflare.com`, `elijah.ns.cloudflare.com` |
| Address | Cloudflare anycast `104.21.80.123`, `172.67.181.13` (apex and `www`) |
| TLS | Google Trust Services `WE1`, CN `lbor.dev`, valid 20 Aug 2026 – 18 Nov 2026 |
| Edge | `server: cloudflare`, HTTP/2, `alt-svc` HTTP/3 |
| Origin | `platform: hostinger`, `panel: hpanel`, `x-turbo-charged-by: LiteSpeed` |
| Cache | `cf-cache-status: DYNAMIC` on HTML, sitemap, and RSS (not cached at the edge) |
| Other headers | `content-security-policy: upgrade-insecure-requests` |

HTML `Last-Modified` on `/` and `/about/` is 23 May 2026, the same day as the latest commit on `main`. RSS was regenerated then too. `/api/posts` still has `Last-Modified` of 3 Nov 2025, which matches an incremental FTP upload: that JSON file has not changed since the November content deploy.

Cloudflare Rocket Loader is rewriting the theme bootstrap script. The live homepage serves it as `type="<hash>-module"` instead of `type="module"`. Rocket Loader is supposed to restore it, but it is an extra moving part in front of a script that exists to set the theme before first paint.

### What production actually serves

These URLs returned **200** and the expected static output:

- `/`, `/about/`, `/sitemap.xml`, `/rss.xml`, `/api/posts`
- `https://www.lbor.dev/` also returned **200** with the same homepage bytes. It does not redirect to the apex. Canonical tags point at `https://lbor.dev`, so the duplicate host is declared, but both hosts answer.

The sitemap lists the four static pages and the four posts above, with trailing slashes and `https://lbor.dev` locations.

These legacy paths returned **404**, not the 301s in `static/.htaccess`:

- `/blog`, `/blog/`
- `/tools/`
- `/links/`

The 404 body is Hostinger’s default error page (`Last-Modified: 22 Apr 2025`), not `src/routes/+error.svelte`. The `.htaccess` redirects are either not applied by this LiteSpeed document root or never landed in `/homepage_root/`.

## Observations

- **Static by design.** A content change is a markdown edit, a push to `main`, a full Vite build, and an FTP sync. Nothing on the server renders Svelte.
- **Vercel adapter is dead weight.** Safe to remove when dependencies are next cleaned up. It does not affect the Hostinger deploy.
- **Two lockfiles.** `pnpm-lock.yaml` can drift from what `npm ci` installs.
- **Legacy redirects are not live.** `/blog`, `/tools`, and `/links` 404 on the host.
- **`www` is a second copy of the site.** Apex is the canonical host in the HTML; DNS serves both.
- **Host 404 replaces the app 404.** Visitors who miss a URL see the Hostinger error page.
- **Rocket Loader touches the theme script.** Worth confirming the first paint stays on the stored colour scheme.
- **Feed type is wrong.** `rel="alternate"` says Atom; the payload is RSS 2.0.
- **Favicon file is unlinked.** `static/favicon.svg` is not referenced from `app.html`.
- **`/api/posts` is public static JSON.** It only contains titles, descriptions, dates, categories, and slugs. It is a build artefact, not an authenticated API.
- **No automated checks in CI.** Typecheck and lint stay local.
- **Shiki language set is narrow.** Fenced blocks outside JavaScript, TypeScript, and PHP will not highlight as those languages.
- **Related posts need shared categories.** The Raycast post is excluded from that feature.
- **Open Graph image is large** (~1.2 MB) for a 1200×630 social image.

## Scripts and secrets

Runtime secrets: none in the app. Deploy secrets live only in GitHub Actions (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`). Do not commit them. The FTP user can write the site document root.
