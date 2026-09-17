# Bayloas Free Tools

Free trucking-industry calculators and guides, meant to be served at
**bayloas.com/tools** while the rest of bayloas.com keeps running on
Hostinger/WordPress, untouched.

Pages:
- `/tools/` - landing page linking to all tools
- `/tools/fuel-cost-calculator.html`
- `/tools/cost-per-mile-calculator.html`
- `/tools/ifta-guide.html`
- `/tools/route-planner.html`

Plain HTML/CSS/JS, no build step, no dependencies - deploys as-is.

## Setup (one-time)

### 1. Deploy this repo to Cloudflare Pages
- Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> connect this
  GitHub repo (`dsbayloas/bayloas-tools`).
- Build command: none. Build output directory: `/` (the repo root).
- Deploy. You'll get a URL like `https://bayloas-tools.pages.dev`.

### 2. Create the Worker that maps it onto bayloas.com/tools
- Cloudflare dashboard -> Workers & Pages -> Create -> Worker.
- Paste in the contents of `worker.js` from this repo.
- Edit the `PAGES_ORIGIN` line to match the *.pages.dev URL from step 1
  (it defaults to `https://bayloas-tools.pages.dev`, which is correct if
  the Pages project is named exactly `bayloas-tools`).
- Deploy the Worker.
- Go to the Worker's **Settings -> Triggers -> Routes** -> Add route:
  - Route: `bayloas.com/tools*`
  - Zone: `bayloas.com`
- This requires bayloas.com's DNS to already be on Cloudflare (orange-cloud
  proxied). If bayloas.com isn't showing up as a zone in your Cloudflare
  account yet, add it there first (Cloudflare will give you nameservers to
  set at Hostinger - this does NOT move your website, WordPress keeps
  running on Hostinger exactly as before).

### 3. Link to it from WordPress
Add a menu item (e.g. "Free Tools") pointing to `/tools` - since it's the
same domain, a relative link is enough.

## Updating content later
Edit the HTML files directly and push - Cloudflare Pages auto-redeploys
on every push to the main branch, live within about a minute.
