// Cloudflare Worker: reverse-proxies bayloas.com/tools/* to this project's
// Cloudflare Pages deployment, so the tools show up under the main
// bayloas.com domain (served by Hostinger/WordPress for everything else)
// with no redirect, no iframe, and zero changes to the WordPress site.
//
// Setup (see README.md for the full walkthrough):
// 1. Deploy this repo as a Cloudflare Pages project (e.g. it gets a URL
//    like bayloas-tools.pages.dev).
// 2. Create a Worker, paste this file's contents in, and set the
//    PAGES_ORIGIN variable below to that project's *.pages.dev URL.
// 3. Add a Worker Route: bayloas.com/tools* -> this Worker.
export default {
  async fetch(request) {
    const PAGES_ORIGIN = 'https://bayloas-tools.pages.dev';
    const url = new URL(request.url);
    const originUrl = new URL(url.pathname + url.search, PAGES_ORIGIN);
    const originRequest = new Request(originUrl.toString(), request);
    return fetch(originRequest);
  },
};
