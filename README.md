# Maliks Paint & Hardware — PowerBuild public website

A standalone catalogue storefront, built for GitHub Pages with HTML, CSS and JavaScript. No Cloudflare, D1, Node.js, database, paid hosting or build step required. This is separate from the Maliks Group Hub and POS.

## Install on GitHub Pages

1. Extract this ZIP to a new folder. Do not merge it into the old Hub repository.
2. In GitHub, create a new public repository called `maliks-website`. Do not initialise with a README if using the command-line installation below.
3. Open the extracted folder (the folder containing `index.html`) in VS Code. Open Terminal → New Terminal.
4. Run the following commands, replacing `YOUR-GITHUB-USERNAME` with your GitHub username:

```powershell
git init
git add .
git commit -m "Launch Maliks Paint and Hardware website"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/maliks-website.git
git push -u origin main
```

5. On GitHub, open the new repository → Settings → Pages. Under Build and deployment choose **Deploy from a branch**, then **main** and **/(root)**. Save.
6. GitHub will show the published address after deployment. Expected address: `https://YOUR-GITHUB-USERNAME.github.io/maliks-website/`.

You can also use GitHub Desktop to add the extracted local repository and publish it. For local preview on a computer, open `index.html` in a browser, or use VS Code Live Server. External supplier photographs require internet access.

## Configure public contact information

Edit `config.js` and enter the verified public sales WhatsApp number (international format, e.g. `27` followed by nine digits, without a plus or spaces). Optionally add a public phone number and email. No personal contact or unverified number is published by default. Until configured, customers use WhatsApp's recipient selection or download/copy their quotation for their chosen sales representative. The site does not submit orders to a server or take payments.

## Catalogue snapshot

Reconstructed from the numbered SQL migrations in the supplied Maliks Group Hub source ZIP dated 24 November 2026, plus the supplied UG department classification. No live D1 or R2 access was used. There were 3,233 active records, 2,554 with image references, and 679 without image references. Only the 2,554 pictured records are included in the website, preserving existing product codes, names, descriptions and categories. The data contains 27 catalogue categories and 12 customer-facing department groupings. 768 products reference 599 distinct bundled local images; these are optimised to WebP. 1,786 products refer to existing remote supplier images and require network access. Remote image availability has not been verified; failures are identified as image unavailable. No products from Adendorff or any new supplier were added. This is a source-code snapshot, not a live stock or pricing feed.

`assets/catalogue.js` contains only public product fields. No internal database, account information, staff details, credentials or source repository history is included. There is no invented pricing or stock status. Confirm permission to publish supplier images and public contact details before launch.

## Site functions

- Responsive storefront, mobile navigation, department browsing, search by name/code, sorting and pagination.
- Product detail views and a quotation basket with quantities, local browser storage, collection/delivery option, address and notes.
- Copy/download the quotation or share through WhatsApp. The customer sends it themselves.
- Images and links use repository-relative paths for GitHub Pages.

## Update

Edit `assets/catalogue.js` or replace it with a new export using the same fields (`id`, `code`, `name`, `description`, `category`, `image`), copy local images under `assets/products/`, commit and push. All prices currently display “Price on request”. Live stock, payment checkout, branch-specific pricing and automatic inventory sync would require a separate backend.

## Validation

All numbered source SQL migrations replayed in SQLite without errors. All bundled local product images decoded successfully. JavaScript syntax checked with Node. Desktop and mobile in-memory Chromium tests passed for rendering, SKU search, product details, quotation item quantities and text, UG department filtering, pagination and mobile viewport overflow. The sandbox browser blocks direct site navigation, so the GitHub deployment, external supplier image availability, localStorage persistence on the actual hosted origin, and live WhatsApp handoff remain to be verified after publication.
