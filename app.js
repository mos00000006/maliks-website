const state = {
  products: [],
  loaded: false,
  query: "",
  department: "",
  category: "",
  sort: "featured",
  page: 1,
  pageSize: 24,
  view: "grid",
  quote: [],
  modalProductId: null,
};

const DEPARTMENTS = [
  { id: "tools", name: "Tools & equipment", shortName: "Tools", description: "Hand tools, power tools and accessories", icon: "wrench", match: (p) => /tools|tork craft|hamiltons/i.test(p.category) },
  { id: "paint", name: "Paint & chemicals", shortName: "Paint & chemicals", description: "Paints, adhesives and treatment products", icon: "paint", match: (p) => /paints & allied|adhesives|waterproofing/i.test(p.category) },
  { id: "plumbing", name: "Plumbing", shortName: "Plumbing", description: "Pipes, fittings, waste and water products", icon: "droplet", match: (p) => /plumbing|underground|pipes|fittings|waste|soil|copper|galvanised/i.test(p.category) },
  { id: "bathroom", name: "Bathroom & tiles", shortName: "Bathroom & tiles", description: "Basins, taps, showers, baths and finishes", icon: "bath", match: (p) => /bathroom|tiles & flooring|kitchens/i.test(p.category) },
  { id: "electrical", name: "Electrical & lighting", shortName: "Electrical", description: "Electrical accessories, lamps and lighting", icon: "bolt", match: (p) => /electrical & lighting/i.test(p.category) },
  { id: "hardware", name: "Hardware & security", shortName: "Hardware & security", description: "Fasteners, ironmongery, locks and doors", icon: "lock", match: (p) => /fasteners|ironmongery|locks|locksets|doors|windows|blinds|general hardware/i.test(p.category) },
  { id: "building", name: "Building essentials", shortName: "Building", description: "Roofing, boards, timber and materials", icon: "building", match: (p) => /roofing|bricks|boards|timber|insulation|steel|fencing/i.test(p.category) },
  { id: "home", name: "Home & garden", shortName: "Home & garden", description: "Useful products for around the home", icon: "home", match: (p) => /homeware|garden/i.test(p.category) },
];

const MALIKS_RANGE = [
  { label: "Paint", description: "Colour, preparation and finishing products for every room.", icon: "paint", category: "Paints & Allied" },
  { label: "Cement & building essentials", description: "Explore building materials, bricks, blocks, timber, boards and more.", icon: "building", department: "building" },
  { label: "Bricks & Blocks", description: "A strong start for foundations, walls and the next stage of your build.", icon: "building", category: "Bricks & Blocks" },
  { label: "Electrical", description: "Electrical accessories and lighting for practical, finished spaces.", icon: "bolt", category: "Electrical & Lighting" },
  { label: "Roofing", description: "Roofing and gutter products to help protect the work below.", icon: "home", category: "Roofing & Gutters" },
];

const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  quote: '<path d="M6 3h12v18H6z"></path><path d="M9 7h6M9 11h6M9 15h3"></path><path d="M15 18h3"></path>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>',
  chevron: '<path d="m6 9 6 6 6-6"></path>',
  chevronUp: '<path d="m6 15 6-6 6 6"></path>',
  plus: '<path d="M12 5v14M5 12h14"></path>',
  minus: '<path d="M5 12h14"></path>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"></path><path d="M4 6h.01M4 12h.01M4 18h.01"></path>',
  check: '<path d="m5 12 4 4L19 6"></path>',
  sparkle: '<path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z"></path><path d="m19 16 .5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z"></path>',
  tag: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12l8 8-8 8H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"></path><circle cx="8" cy="8" r="1"></circle>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle>',
  people: '<circle cx="9" cy="8" r="3"></circle><path d="M3 19a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-5M17 14a4.5 4.5 0 0 1 4 4.5"></path>',
  project: '<path d="M3 20h18M5 17V9h14v8M8 9V5h8v4M10 13h4M10 16h4"></path>',
  worker: '<circle cx="9" cy="8" r="3"></circle><path d="M3 19a6 6 0 0 1 12 0M16 6h4M18 4v4"></path>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"></path>',
  info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path>',
  store: '<path d="M4 10h16v10H4z"></path><path d="M3 10 5 4h14l2 6M8 10v10M16 10v10"></path>',
  close: '<path d="m6 6 12 12M18 6 6 18"></path>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>',
  download: '<path d="M12 4v11M8 11l4 4 4-4M5 20h14"></path>',
  print: '<path d="M6 9V4h12v5M6 17H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2"></path><path d="M6 14h12v6H6z"></path>',
  eye: '<path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z"></path><circle cx="12" cy="12" r="2.5"></circle>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.4-.6-.6-2.4 2.3-2.3Z"></path>',
  paint: '<path d="M4 5h12v6H4zM16 8h2a2 2 0 0 1 2 2v1h-4M9 11v8a2 2 0 0 0 4 0v-3"></path>',
  droplet: '<path d="M12 3s6 6.2 6 11a6 6 0 1 1-12 0c0-4.8 6-11 6-11Z"></path>',
  bath: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V7a3 3 0 0 1 5.7-1.3L13 8"></path><path d="M7 19v2M17 19v2"></path>',
  bolt: '<path d="m13 2-8 11h6l-1 9 8-11h-6l1-9Z"></path>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"></path>',
  building: '<path d="M4 20V5l8-2 8 2v15M4 20h16M8 8h2M14 8h2M8 12h2M14 12h2M10 20v-4h4v4"></path>',
  home: '<path d="m3 11 9-8 9 8v9H3v-9Z"></path><path d="M9 20v-6h6v6"></path>',
};

function icon(name, extraClass = "") {
  return `<svg class="icon icon-${name} ${extraClass}" aria-hidden="true" viewBox="0 0 24 24">${ICON_PATHS[name] || ICON_PATHS.grid}</svg>`;
}

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return Array.from(document.querySelectorAll(selector)); }

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hydrateStaticIcons() {
  const classMap = {
    "search-icon": "search",
    "quote-icon": "quote",
    "menu-icon": "menu",
    "chevron-icon": "chevron",
    "chevron-up-icon": "chevronUp",
    "plus-icon": "plus",
    "grid-icon": "grid",
    "list-icon": "list",
    "check-icon": "check",
    "sparkle-icon": "sparkle",
    "building-icon": "building",
    "tag-icon": "tag",
    "truck-icon": "truck",
    "home-icon": "home",
    "people-icon": "people",
    "project-icon": "project",
    "worker-icon": "worker",
    "filter-icon": "filter",
    "info-icon": "info",
    "store-icon": "store",
    "close-icon": "close",
    "copy-icon": "copy",
    "download-icon": "download",
    "print-icon": "print",
  };
  for (const [className, name] of Object.entries(classMap)) {
    for (const element of $all(`.${className}`)) {
      if (!element.querySelector(".icon") && element.tagName !== "svg") element.innerHTML = icon(name);
    }
  }
  for (const element of $all("#clearSearch, .close-filter, .close-drawer, .modal-close")) {
    if (!element.querySelector(".icon")) element.innerHTML = icon("close");
  }
}

function departmentById(id) {
  return DEPARTMENTS.find((department) => department.id === id) || null;
}

function departmentForProduct(product) {
  return DEPARTMENTS.find((department) => department.match(product)) || null;
}

function categoryIcon(category) {
  const product = { category: category || "" };
  return departmentForProduct(product)?.icon || "grid";
}

function imageMarkup(product, className = "") {
  const fallback = `<div class="product-placeholder ${className}">${icon(categoryIcon(product.category))}</div>`;
  if (!product.image) return fallback;
  return `${fallback}<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" />`;
}

function loadSavedQuote() {
  try {
    const saved = JSON.parse(localStorage.getItem("maliksQuoteListV1") || "[]");
    return Array.isArray(saved) ? saved.filter((line) => Number.isFinite(Number(line.id)) && Number(line.qty) > 0).map((line) => ({ id: Number(line.id), qty: Math.max(1, Number(line.qty)) })) : [];
  } catch {
    return [];
  }
}

function saveQuote() {
  localStorage.setItem("maliksQuoteListV1", JSON.stringify(state.quote));
}

function totalQuoteUnits() {
  return state.quote.reduce((total, line) => total + line.qty, 0);
}

function quoteText() {
  const lines = ["Maliks Paint and Hardware — quote list", "", ...state.quote.map((line, index) => {
    const product = state.products.find((item) => item.id === line.id);
    return product ? `${index + 1}. ${product.name} | Code: ${product.code} | Qty: ${line.qty} | Category: ${product.category}` : "";
  }).filter(Boolean)];
  lines.push("", "Prices, quantities and availability to be confirmed with the Maliks team.");
  return lines.join("\n");
}

function renderDepartmentCards() {
  const counts = new Map(DEPARTMENTS.map((department) => [department.id, 0]));
  for (const product of state.products) {
    const department = departmentForProduct(product);
    if (department) counts.set(department.id, counts.get(department.id) + 1);
  }
  $("#departmentCards").innerHTML = DEPARTMENTS.map((department) => `
    <button class="department-card" type="button" data-department="${department.id}">
      <span class="icon-wrap">${icon(department.icon)}</span>
      <span><h3>${escapeHtml(department.name)}</h3><p>${counts.get(department.id).toLocaleString()} catalogue items</p></span>
    </button>
  `).join("");
}

function renderDepartmentMenu() {
  $("#departmentMenu").innerHTML = DEPARTMENTS.map((department) => `
    <a href="#catalogue" data-menu-department="${department.id}">${icon(department.icon)}<span>${escapeHtml(department.name)}</span></a>
  `).join("");
}

function rangeProducts(range) {
  const candidates = state.products.filter((product) => {
    if (range.category) return product.category === range.category;
    if (range.department) return productMatchesDepartmentFor(product, range.department);
    return false;
  });
  return { product: candidates.find((product) => product.image) || candidates[0] || null, count: candidates.length };
}

function productMatchesDepartmentFor(product, departmentId) {
  if (departmentId === "other") return !departmentForProduct(product);
  return departmentById(departmentId)?.match(product) || false;
}

function rangeImageMarkup(range, product) {
  const placeholder = `<div class="range-placeholder">${icon(range.icon)}</div>`;
  if (!product?.image) return placeholder;
  return `${placeholder}<img src="${escapeHtml(product.image)}" alt="${escapeHtml(range.label)} from the Maliks catalogue" loading="lazy" decoding="async" />`;
}

function renderMaliksRange() {
  const cards = MALIKS_RANGE.map((range) => {
    const { product, count } = rangeProducts(range);
    const action = range.category
      ? `data-range-category="${escapeHtml(range.category)}"`
      : `data-range-department="${escapeHtml(range.department)}"`;
    return `
      <button class="range-card" type="button" ${action}>
        <span class="range-image">${rangeImageMarkup(range, product)}</span>
        <span class="range-copy"><span class="range-kicker">${count.toLocaleString()} catalogue items</span><strong>${escapeHtml(range.label)}</strong><small>${escapeHtml(range.description)}</small><span class="range-link">Explore range ${icon("chevron")}</span></span>
      </button>
    `;
  }).join("");
  $("#rangeCards").innerHTML = cards;
  attachImageFallbacks();
}

function renderDepartmentFilters() {
  const counts = new Map(DEPARTMENTS.map((department) => [department.id, 0]));
  let uncategorised = 0;
  for (const product of state.products) {
    const department = departmentForProduct(product);
    if (department) counts.set(department.id, counts.get(department.id) + 1);
    else uncategorised += 1;
  }
  const all = state.products.length;
  $("#departmentFilters").innerHTML = [
    `<button class="department-filter ${state.department === "" ? "is-active" : ""}" type="button" data-filter-department=""><span>All catalogue</span><small>${all.toLocaleString()}</small></button>`,
    ...DEPARTMENTS.map((department) => `<button class="department-filter ${state.department === department.id ? "is-active" : ""}" type="button" data-filter-department="${department.id}"><span>${escapeHtml(department.shortName)}</span><small>${counts.get(department.id).toLocaleString()}</small></button>`),
    uncategorised ? `<button class="department-filter ${state.department === "other" ? "is-active" : ""}" type="button" data-filter-department="other"><span>Other catalogue</span><small>${uncategorised.toLocaleString()}</small></button>` : "",
  ].join("");
}

function renderCategorySelect() {
  const counts = new Map();
  for (const product of state.products) counts.set(product.category, (counts.get(product.category) || 0) + 1);
  const categories = Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  $("#categorySelect").innerHTML = `<option value="">All categories</option>${categories.map(([category, count]) => `<option value="${escapeHtml(category)}" ${state.category === category ? "selected" : ""}>${escapeHtml(category)} (${count.toLocaleString()})</option>`).join("")}`;
}

function productMatchesDepartment(product) {
  if (!state.department) return true;
  if (state.department === "other") return !departmentForProduct(product);
  return departmentById(state.department)?.match(product) || false;
}

function filteredProducts() {
  const terms = state.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filtered = state.products.filter((product) => {
    if (state.category && product.category !== state.category) return false;
    if (!productMatchesDepartment(product)) return false;
    if (!terms.length) return true;
    const haystack = `${product.name} ${product.code} ${product.description} ${product.category}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });

  return filtered.sort((a, b) => {
    if (state.sort === "name") return a.name.localeCompare(b.name);
    if (state.sort === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    if (state.sort === "newest") return b.id - a.id;
    return Number(Boolean(b.image)) - Number(Boolean(a.image)) || b.id - a.id;
  });
}

function productCard(product) {
  const inQuote = state.quote.some((line) => line.id === product.id);
  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        ${imageMarkup(product)}
        <span class="product-badge">Catalogue</span>
        <button class="quick-view" type="button" data-quick-view="${product.id}" aria-label="View ${escapeHtml(product.name)}">${icon("eye")}</button>
      </div>
      <div class="product-copy">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h3 class="product-title">${escapeHtml(product.name)}</h3>
        <span class="product-code">${escapeHtml(product.code)}</span>
        <div class="product-footer">
          <span class="price-note">Price on request</span>
          <button class="add-quote ${inQuote ? "is-added" : ""}" type="button" data-add-quote="${product.id}">${icon(inQuote ? "check" : "plus")}<span>${inQuote ? "Added" : "Add to quote"}</span></button>
        </div>
      </div>
    </article>
  `;
}

function renderSkeletons() {
  $("#productGrid").innerHTML = Array.from({ length: 6 }, () => `<div class="skeleton-card"><div class="skeleton-block skeleton-image"></div><div class="skeleton-copy"><div class="skeleton-block skeleton-line short"></div><div class="skeleton-block skeleton-line long"></div><div class="skeleton-block skeleton-line short"></div></div></div>`).join("");
}

function renderPagination(totalPages) {
  const pagination = $("#pagination");
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }
  const pages = new Set([1, totalPages, state.page, state.page - 1, state.page + 1].filter((page) => page > 0 && page <= totalPages));
  const ordered = Array.from(pages).sort((a, b) => a - b);
  const parts = [];
  if (state.page > 1) parts.push(`<button class="page-button" type="button" data-page="${state.page - 1}" aria-label="Previous page">${icon("chevron")}</button>`);
  let previous = 0;
  for (const page of ordered) {
    if (previous && page - previous > 1) parts.push(`<span class="page-ellipsis">…</span>`);
    parts.push(`<button class="page-button ${page === state.page ? "is-active" : ""}" type="button" data-page="${page}" ${page === state.page ? 'aria-current="page"' : ""}>${page}</button>`);
    previous = page;
  }
  if (state.page < totalPages) parts.push(`<button class="page-button" type="button" data-page="${state.page + 1}" aria-label="Next page">${icon("chevron", "next-chevron")}</button>`);
  pagination.innerHTML = parts.join("");
  const next = pagination.querySelector(".next-chevron");
  if (next) next.style.transform = "rotate(-90deg)";
  const previousButton = pagination.querySelector('[aria-label="Previous page"] .icon');
  if (previousButton) previousButton.style.transform = "rotate(90deg)";
}

function renderActiveFilter() {
  const labels = [];
  if (state.query) labels.push(`Search: “${state.query}”`);
  if (state.department) labels.push(departmentById(state.department)?.name || "Other catalogue");
  if (state.category) labels.push(state.category);
  const element = $("#activeFilter");
  const activeCount = labels.length;
  $("#filterActiveCount").hidden = activeCount === 0;
  $("#filterActiveCount").textContent = String(activeCount);
  if (!labels.length) {
    element.hidden = true;
    element.innerHTML = "";
    return;
  }
  element.hidden = false;
  element.innerHTML = `<span>${escapeHtml(labels.join(" · "))}</span><button type="button" id="clearAllActive" aria-label="Clear active filters">${icon("close")}</button>`;
}

function renderCatalogue() {
  if (!state.loaded) return;
  const filtered = filteredProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * state.pageSize;
  const visible = filtered.slice(start, start + state.pageSize);
  $("#productGrid").classList.toggle("list-view", state.view === "list");
  $("#productGrid").innerHTML = visible.map(productCard).join("");
  $("#emptyState").hidden = filtered.length > 0;
  $("#pagination").hidden = filtered.length === 0;
  $("#resultCount").textContent = filtered.length ? `Showing ${(start + 1).toLocaleString()}–${Math.min(start + visible.length, filtered.length).toLocaleString()} of ${filtered.length.toLocaleString()}` : "0 results";
  $("#resultCount").nextElementSibling.textContent = state.query || state.department || state.category ? "matching products" : "products in the current view";
  renderPagination(totalPages);
  renderActiveFilter();
  renderDepartmentFilters();
  renderCategorySelect();
  attachImageFallbacks();
  syncUrl();
}

function attachImageFallbacks() {
  for (const image of $all("img")) {
    if (image.dataset.fallbackBound) continue;
    image.dataset.fallbackBound = "1";
    const logo = image.closest(".client-logo");
    if (logo) {
      image.addEventListener("load", () => logo.classList.add("image-ready"), { once: true });
      if (image.complete && image.naturalWidth > 0) logo.classList.add("image-ready");
    }
    image.addEventListener("error", () => {
      if (logo) logo.classList.add("image-missing");
      image.remove();
    });
  }
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.department) params.set("department", state.department);
  if (state.category) params.set("category", state.category);
  if (state.sort !== "featured") params.set("sort", state.sort);
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash || ""}`;
  window.history.replaceState({}, "", url);
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  state.query = params.get("q") || "";
  state.department = params.get("department") || "";
  state.category = params.get("category") || "";
  state.sort = ["featured", "name", "category", "newest"].includes(params.get("sort")) ? params.get("sort") : "featured";
  $("#globalSearch").value = state.query;
  $("#clearSearch").hidden = !state.query;
  $("#sortSelect").value = state.sort;
}

function setFilters(next = {}, shouldScroll = false) {
  if (Object.prototype.hasOwnProperty.call(next, "query")) state.query = next.query;
  if (Object.prototype.hasOwnProperty.call(next, "department")) state.department = next.department;
  if (Object.prototype.hasOwnProperty.call(next, "category")) state.category = next.category;
  state.page = 1;
  $("#globalSearch").value = state.query;
  $("#clearSearch").hidden = !state.query;
  if (shouldScroll) $("#catalogue").scrollIntoView({ behavior: "smooth", block: "start" });
  renderCatalogue();
}

function openQuote() {
  $("#quoteDrawer").classList.add("is-open");
  $("#quoteDrawer").setAttribute("aria-hidden", "false");
  $("#scrim").hidden = false;
  document.body.classList.add("drawer-open");
  closeFilters();
}

function closeQuote() {
  $("#quoteDrawer").classList.remove("is-open");
  $("#quoteDrawer").setAttribute("aria-hidden", "true");
  $("#scrim").hidden = true;
  document.body.classList.remove("drawer-open");
}

function openFilters() {
  $("#filterPanel").classList.add("is-open");
  $("#scrim").hidden = false;
  document.body.classList.add("drawer-open");
  closeQuote();
  $("#filterPanel").classList.add("is-open");
  $("#scrim").hidden = false;
  document.body.classList.add("drawer-open");
}

function closeFilters() {
  $("#filterPanel").classList.remove("is-open");
  if (!$("#quoteDrawer").classList.contains("is-open")) {
    $("#scrim").hidden = true;
    document.body.classList.remove("drawer-open");
  }
}

function addToQuote(id) {
  const existing = state.quote.find((line) => line.id === id);
  if (existing) existing.qty += 1;
  else state.quote.push({ id, qty: 1 });
  saveQuote();
  renderQuote();
  renderCatalogue();
  const product = state.products.find((item) => item.id === id);
  showDrawerStatus(product ? `${product.name} added to your quote list.` : "Added to your quote list.");
}

function removeFromQuote(id) {
  state.quote = state.quote.filter((line) => line.id !== id);
  saveQuote();
  renderQuote();
  renderCatalogue();
}

function changeQuoteQuantity(id, delta) {
  const line = state.quote.find((item) => item.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) removeFromQuote(id);
  else { saveQuote(); renderQuote(); }
}

function renderQuote() {
  const count = state.quote.length;
  $("#quoteCount").textContent = String(count);
  $("#quoteItemTotal").textContent = String(totalQuoteUnits());
  const items = $("#quoteItems");
  if (!count) {
    items.innerHTML = `<div class="quote-empty">${icon("quote")}<strong>Your quote list is empty</strong><p>Add catalogue items here while you browse. You can copy or download the list when you are ready.</p></div>`;
    $("#copyQuote").disabled = true;
    $("#downloadQuote").disabled = true;
    $("#printQuote").disabled = true;
    return;
  }
  $("#copyQuote").disabled = false;
  $("#downloadQuote").disabled = false;
  $("#printQuote").disabled = false;
  items.innerHTML = state.quote.map((line) => {
    const product = state.products.find((item) => item.id === line.id);
    if (!product) return "";
    return `<div class="quote-line"><div class="quote-line-image">${imageMarkup(product)}</div><div class="quote-line-copy"><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.code)}</span></div><div class="quote-line-actions"><button class="remove-line" type="button" data-remove-quote="${product.id}">Remove</button><div class="quantity-control"><button type="button" aria-label="Decrease quantity" data-quantity="${product.id}" data-delta="-1">${icon("minus")}</button><span>${line.qty}</span><button type="button" aria-label="Increase quantity" data-quantity="${product.id}" data-delta="1">${icon("plus")}</button></div></div></div>`;
  }).join("");
  attachImageFallbacks();
}

function showDrawerStatus(message) {
  $("#drawerStatus").textContent = message;
  window.clearTimeout(showDrawerStatus.timer);
  showDrawerStatus.timer = window.setTimeout(() => { $("#drawerStatus").textContent = ""; }, 3400);
}

function openProductModal(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  state.modalProductId = id;
  $("#modalProductImage").innerHTML = imageMarkup(product);
  $("#productModalCategory").textContent = product.category;
  $("#productModalTitle").textContent = product.name;
  $("#productModalCode").textContent = product.code;
  $("#productModalDescription").textContent = product.description || "Catalogue product. Ask the Maliks team for current pricing, quantities and availability.";
  $("#modalAddQuote").innerHTML = `${icon(state.quote.some((line) => line.id === id) ? "check" : "quote")}<span>${state.quote.some((line) => line.id === id) ? "Added to quote list" : "Add to quote list"}</span>`;
  $("#productModal").hidden = false;
  document.body.classList.add("modal-open");
  attachImageFallbacks();
}

function closeProductModal() {
  $("#productModal").hidden = true;
  document.body.classList.remove("modal-open");
  state.modalProductId = null;
}

function copyQuoteList() {
  const text = quoteText();
  if (!state.quote.length) return;
  navigator.clipboard?.writeText(text).then(() => showDrawerStatus("Quote list copied to your clipboard.")).catch(() => showDrawerStatus("Copy is unavailable here. Use Download list instead."));
}

function downloadQuoteList() {
  if (!state.quote.length) return;
  const blob = new Blob([quoteText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "maliks-quote-list.txt";
  link.click();
  URL.revokeObjectURL(url);
  showDrawerStatus("Quote list downloaded.");
}

function printQuoteList() {
  if (!state.quote.length) return;
  $("#printDate").textContent = `Prepared ${new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(new Date())}`;
  $("#printLines").innerHTML = state.quote.map((line) => {
    const product = state.products.find((item) => item.id === line.id);
    return product ? `<div class="print-line"><strong>${escapeHtml(product.name)}<br /><span>${escapeHtml(product.category)}</span></strong><span>${escapeHtml(product.code)}</span><span>Qty: ${line.qty}</span></div>` : "";
  }).join("");
  window.print();
}

function initBranchMap() {
  const mapElement = document.querySelector("#branchMap");
  if (!mapElement) return;
  if (!window.L) {
    const fallback = mapElement.querySelector(".map-fallback");
    if (fallback) fallback.textContent = "The map is unavailable right now. Search the branch list below to open directions.";
    return;
  }

  const cards = $all(".store-card");
  if (!cards.length) return;
  mapElement.innerHTML = "";
  const map = window.L.map(mapElement, { scrollWheelZoom: false, tap: true });
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  }).addTo(map);

  const bounds = [];
  cards.forEach((card, index) => {
    const lat = Number(card.dataset.lat);
    const lng = Number(card.dataset.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const name = card.querySelector("h3")?.textContent.trim() || "PowerBuild branch";
    const address = card.querySelector("address")?.textContent.trim() || "";
    const phone = card.querySelector(".store-phone");
    const directions = card.querySelector(".store-directions");
    const icon = window.L.divIcon({
      className: "branch-pin-icon",
      html: `<span class="branch-map-pin"><b>${index + 1}</b></span>`,
      iconSize: [30, 34],
      iconAnchor: [15, 32],
      popupAnchor: [0, -30],
    });
    const phoneLink = phone ? `<a href="${escapeHtml(phone.getAttribute("href"))}">${escapeHtml(phone.textContent.trim())}</a>` : "";
    const directionsLink = directions ? `<a href="${escapeHtml(directions.href)}" target="_blank" rel="noopener">Open directions</a>` : "";
    const popup = `<div class="branch-map-popup"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(address)}</span><span>${phoneLink}</span>${directionsLink}</div>`;
    window.L.marker([lat, lng], { icon, title: name, alt: name }).addTo(map).bindPopup(popup);
    bounds.push([lat, lng]);
  });

  if (bounds.length) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 11 });
  window.setTimeout(() => map.invalidateSize(), 120);
}

function toggleDepartmentMenu() {
  const button = $("#departmentToggle");
  const menu = $("#departmentMenu");
  const open = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!open));
  menu.hidden = open;
}

async function loadProducts() {
  renderSkeletons();
  try {
    const response = await fetch("data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Catalogue request failed: ${response.status}`);
    const payload = await response.json();
    state.products = Array.isArray(payload.products) ? payload.products : [];
    state.loaded = true;
    renderDepartmentCards();
    renderDepartmentMenu();
    renderMaliksRange();
    renderCatalogue();
    renderQuote();
  } catch (error) {
    console.error(error);
    $("#productGrid").innerHTML = `<div class="empty-state"><div class="empty-icon">${icon("info")}</div><h3>Catalogue temporarily unavailable</h3><p>Refresh the page to load the latest product range.</p><button class="button button-primary" type="button" onclick="window.location.reload()">Refresh catalogue</button></div>`;
    $("#resultCount").textContent = "Catalogue unavailable";
  }
}

function bindEvents() {
  const storeSearch = document.querySelector("#storeSearch");
  if (storeSearch) {
    storeSearch.addEventListener("input", () => {
      const query = storeSearch.value.trim().toLowerCase();
      const cards = $all(".store-card");
      let visible = 0;
      for (const card of cards) {
        const matches = !query || `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      }
      const results = document.querySelector("#storeResults");
      if (results) results.textContent = query ? `${visible} ${visible === 1 ? "branch" : "branches"} found` : `${visible} branches`;
      const empty = document.querySelector("#storeEmpty");
      if (empty) empty.hidden = visible > 0;
    });
  }

  $("#globalSearch").addEventListener("input", (event) => setFilters({ query: event.target.value }));
  $("#clearSearch").addEventListener("click", () => setFilters({ query: "" }));
  $("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; state.page = 1; renderCatalogue(); });
  $("#categorySelect").addEventListener("change", (event) => setFilters({ category: event.target.value }));
  $("#departmentToggle").addEventListener("click", toggleDepartmentMenu);
  $("#openQuote").addEventListener("click", openQuote);
  $("#openQuoteFromHelp").addEventListener("click", openQuote);
  $("#closeQuote").addEventListener("click", closeQuote);
  $("#scrim").addEventListener("click", () => { closeQuote(); closeFilters(); });
  $("#openFilters").addEventListener("click", openFilters);
  $("#closeFilters").addEventListener("click", closeFilters);
  $("#clearDepartment").addEventListener("click", () => setFilters({ department: "" }));
  $("#resetSearch").addEventListener("click", () => setFilters({ query: "", department: "", category: "" }));
  $("#closeProductModal").addEventListener("click", closeProductModal);
  $("#productModal").addEventListener("click", (event) => { if (event.target === $("#productModal")) closeProductModal(); });
  $("#modalAddQuote").addEventListener("click", () => { if (state.modalProductId != null) { addToQuote(state.modalProductId); openProductModal(state.modalProductId); } });
  $("#copyQuote").addEventListener("click", copyQuoteList);
  $("#downloadQuote").addEventListener("click", downloadQuoteList);
  $("#printQuote").addEventListener("click", printQuoteList);
  $("#gridView").addEventListener("click", () => { state.view = "grid"; $("#gridView").classList.add("is-active"); $("#listView").classList.remove("is-active"); renderCatalogue(); });
  $("#listView").addEventListener("click", () => { state.view = "list"; $("#listView").classList.add("is-active"); $("#gridView").classList.remove("is-active"); renderCatalogue(); });
  for (const element of $all("[data-show-all]")) element.addEventListener("click", () => setFilters({ department: "", category: "" }, true));

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, a");
    if (!target) return;
    const department = target.dataset.department || target.dataset.menuDepartment;
    if (department) {
      event.preventDefault();
      setFilters({ department, category: "" }, true);
      $("#departmentToggle").setAttribute("aria-expanded", "false");
      $("#departmentMenu").hidden = true;
      closeFilters();
      return;
    }
    if (target.dataset.rangeCategory) {
      event.preventDefault();
      setFilters({ department: "", category: target.dataset.rangeCategory }, true);
      return;
    }
    if (target.dataset.rangeDepartment) {
      event.preventDefault();
      setFilters({ department: target.dataset.rangeDepartment, category: "" }, true);
      return;
    }
    if (target.dataset.filterDepartment != null) {
      setFilters({ department: target.dataset.filterDepartment, category: "" });
      return;
    }
    if (target.dataset.addQuote) { addToQuote(Number(target.dataset.addQuote)); return; }
    if (target.dataset.quickView) { openProductModal(Number(target.dataset.quickView)); return; }
    if (target.dataset.removeQuote) { removeFromQuote(Number(target.dataset.removeQuote)); return; }
    if (target.dataset.quantity) { changeQuoteQuantity(Number(target.dataset.quantity), Number(target.dataset.delta)); return; }
    if (target.dataset.page) { state.page = Number(target.dataset.page); renderCatalogue(); $("#catalogue").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (target.id === "clearAllActive") { setFilters({ query: "", department: "", category: "" }); return; }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeQuote();
    closeFilters();
    closeProductModal();
  });
}

function init() {
  hydrateStaticIcons();
  readUrlState();
  state.quote = loadSavedQuote();
  initBranchMap();
  bindEvents();
  loadProducts();
}

init();
