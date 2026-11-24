# Maliks Paint and Hardware — Catalogue Storefront

This is a buildless, GitHub Pages-ready storefront generated from the active Maliks catalogue. It is intentionally separate from the Maliks Group Hub operational application.

## Local preview

From this folder, run any static server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Refreshing products

From the repository root, run:

```bash
node scripts/build-catalogue-site-data.mjs
```

The storefront reads `data/products.json`. Product pricing is not embedded because the source catalogue does not provide public selling prices for every item; the site uses a quote list instead.

## GitHub Pages

Publish the contents of `catalogue-site/` as the Pages source, or copy this folder to the root of a dedicated storefront repository. The site has no build step and no server-side dependencies.
