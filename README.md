# Maliks Paint and Hardware — Catalogue Storefront

This is a buildless, GitHub Pages-ready storefront generated from the active Maliks catalogue. It combines the catalogue shopping experience with the public Maliks Paint and Hardware content: the complete-building-solutions hero, six service promises, range highlights, testimonials, community message and contact details. It is intentionally separate from the Maliks Group Hub operational application.

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

The current data file contains 3,233 active catalogue products. The range cards for Paint, Cement & building essentials, Bricks & Blocks, Electrical and Roofing link directly into the matching catalogue filter.

## GitHub Pages

Publish the contents of `catalogue-site/` as the Pages source, or copy this folder to the root of a dedicated storefront repository. The site has no build step and no server-side dependencies.
