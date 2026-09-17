# Bayloas Free Tools

Free tools for owner-operators and small fleets, served at **tools.bayloas.com**
as its own Cloudflare Pages custom domain - completely separate from the
main bayloas.com site, which keeps running on Hostinger/WordPress untouched.

Two groups of tools:

**Find money you're owed:**
- `/load-profitability-checker.html` - "Should I Take This Load?"
- `/detention-pay-calculator.html` - detention/layover pay + a ready-to-send message
- `/per-diem-tax-estimator.html` - rough tax savings from the per diem deduction

**Know your numbers / stay compliant:**
- `/cost-per-mile-calculator.html`
- `/fuel-cost-calculator.html`
- `/hos-clock-calculator.html`
- `/ifta-guide.html`
- `/route-planner.html`

Plain HTML/CSS/JS, no build step, no dependencies - deploys as-is.

## Setup

Already deployed to Cloudflare Pages with a custom domain
(`tools.bayloas.com`) attached directly to the Pages project - no Worker
or DNS routing needed, since it's its own subdomain rather than a path
under bayloas.com.

To redeploy or check status: Cloudflare dashboard -> Workers & Pages ->
`bayloas-tools` project -> Deployments.

## Updating content later
Edit the HTML files directly and push - Cloudflare Pages auto-redeploys
on every push to the main branch, live within about a minute.

## Link from WordPress
Add a menu item (e.g. "Free Tools") pointing to `https://tools.bayloas.com`.
