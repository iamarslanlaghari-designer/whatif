# WhatIf source audit handoff

## Changes applied in this source package

- Fixed the footer Privacy Policy route from `/privacy-policy` to `/privacy`.
- Added Disclaimer and Contact links to the footer.
- Avoided duplicate global header/footer on the homepage, which already renders its own.
- Avoided rendering the shared header over the Explore application screens, which have their own navigation.
- Made the shared header and mobile menu respond to the persisted light/dark theme.
- Added a shared persistent theme hook for About, Features, How It Works, FAQ, Contact, Privacy, Terms, Disclaimer, and 404 pages.
- Updated the homepage theme initialization to read the saved theme preference.
- Added route-specific SEO metadata layouts for marketing, legal, Explore, and Decision Center pages.
- Added `app/sitemap.ts` and `app/robots.ts`; sitemap URLs are emitted only after `NEXT_PUBLIC_SITE_URL` is configured.
- Kept the Contact form's current mail-app behavior and clarified that the visitor must send the email.

## Still requires your configuration or live testing

- Set `GROQ_API_KEY` in your local `.env.local` file. Do not put the key in client-side code or upload it publicly.
- Set `NEXT_PUBLIC_SITE_URL` to the actual production domain before deployment.
- The Contact form currently opens the visitor's email app; it does not submit to a server or send mail automatically. A mail provider/backend is needed for direct form delivery.
- API endpoints have input validation but no production-grade shared rate limiter. Add an external rate limiter (for example, Redis/Upstash or hosting-provider protection) before public launch.
- Privacy, Terms, and Disclaimer text must be checked against actual data retention, cookies, analytics, AI processing, hosting, and applicable laws.
- Mobile appearance, browser interactions, API responses, and performance require a live browser test.
- Dependency installation timed out in this environment, so a production build, TypeScript check, and ESLint run could not be completed here.

## Follow-up fixes in this updated package

- Escaped apostrophes in JSX text that triggered `react/no-unescaped-entities`.
- Replaced internal `window.location.href` navigation with Next.js router navigation on the homepage and Review screen. The Contact page intentionally retains its `mailto:` link behavior.
- Addressed the React Hooks `set-state-in-effect` lint findings for browser-storage/theme hydration with narrowly scoped rule comments. These effects synchronize initial React state with browser-only storage after mount; they do not represent user-action state updates.
- Validated saved decision records before rendering the Decisions editor.
- Made malformed JSON request bodies return HTTP 400 from both API routes rather than falling through to a generic server error.
- Added baseline security response headers and disabled the `X-Powered-By` header.
- Added canonical metadata for public marketing/legal pages, root-level SEO keywords, and safer handling of an unset or invalid `NEXT_PUBLIC_SITE_URL`.
- Updated the sitemap to include only public, indexable pages. It returns no URLs until a real production site URL is configured, rather than publishing localhost URLs.
- Marked the session-dependent `/explore` workflow pages as noindex and excluded `/explore` and `/api` from crawling.
- Added `.env.example` and deployment notes for `NEXT_PUBLIC_SITE_URL` and the server-side `GROQ_API_KEY`.

## Verification performed for this package

- TypeScript/TSX syntax transpilation check: 56 source files parsed with zero syntax diagnostics.
- A full dependency install could not complete in this environment: npm registry requests failed with DNS `EAI_AGAIN`, and the offline cache did not contain all required packages.
- Because dependencies could not be installed, `npm run lint`, the full TypeScript project check, and `npm run build` could not be run here. Run these commands locally after `npm ci` succeeds.

## Remaining launch requirements

- Set `NEXT_PUBLIC_SITE_URL` to the final production origin in the deployment environment.
- Set `GROQ_API_KEY` as a server-side secret.
- Add a shared production rate limiter for `/api/analyze` and `/api/chat` (for example, an edge/hosting rate limit or Redis-backed limiter). An in-process limiter is not reliable across serverless instances.
- Confirm the Privacy Policy, Terms, and Disclaimer match the actual hosting, AI provider, data retention, cookies, analytics, and legal requirements.
- Complete live browser testing for mobile layouts, theme behavior, AI provider responses, and end-to-end decision workflows before launch.
