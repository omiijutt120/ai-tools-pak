const WHATSAPP_NUMBER = window.AI_TOOLS_CONFIG?.whatsappNumber || "923714549245";
const CART_KEY = "ai-tools-pak-cart";
const products = window.AI_TOOLS_PRODUCTS || [];
const productBySlug = new Map(products.map((product) => [product.slug, product]));
const productByName = new Map(products.map((product) => [product.name, product]));
const categoryDescriptions = {
  "AI Assistants": "Research, chat and reasoning",
  "AI Video": "Editors, avatars and generation",
  "AI Images and Design": "Creative assets and visuals",
  "AI Voice": "Speech, dubbing and narration",
  "Writing and SEO": "Copy, grammar and ranking",
  "Development and Coding": "Build, debug and ship faster",
  "Marketing and Lead Generation": "Growth, outreach and channels"
};

const productGrid = document.querySelector("#productGrid");
const categoryGrid = document.querySelector("#categoryGrid");
const searchInput = document.querySelector("#searchInput");
const cartCount = document.querySelector("#cartCount");
const detailDialog = document.querySelector("#detailDialog");
const dialogContent = document.querySelector("#dialogContent");
const formatter = new Intl.NumberFormat("en-PK");
let cartItems = loadCart();
let activeCategory = "";
let lastWhatsAppClick = 0;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function productMessage(product, intent) {
  return [
    `Hi AI Tools Pak, I want to ${intent}:`,
    `Product: ${product.name}`,
    `SKU: ${product.sku}`,
    `Plan: ${product.planTier}`,
    `Price: PKR ${formatter.format(product.sellingPricePkr)}`,
    `Duration: ${product.subscriptionDuration}`,
    `Access: ${product.accessType}`,
    `Delivery: ${product.deliveryMethod}`,
    `Credits / limits: ${product.creditsOrUsageLimit}`
  ].join("\n");
}

function normalizeCartItem(item) {
  if (productBySlug.has(item)) return item;
  return productByName.get(item)?.slug || "";
}

function cartMessage() {
  const selected = cartItems.map((slug) => productBySlug.get(slug)).filter(Boolean);
  const lines = selected.map((product, index) => `${index + 1}. ${product.name} - PKR ${formatter.format(product.sellingPricePkr)}`);
  const total = selected.reduce((sum, product) => sum + product.sellingPricePkr, 0);
  return [`Hi AI Tools Pak, I want to order these items:`, ...lines, `Total items: ${selected.length}`, `Estimated total: PKR ${formatter.format(total)}`].join("\n");
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved.map(normalizeCartItem).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch {}
  cartCount.textContent = cartItems.length;
}

function priceHtml(product) {
  const compare = Number(product.compareAtPricePkr);
  const compareHtml = Number.isFinite(compare) && compare > product.sellingPricePkr
    ? `<span class="compare-price">PKR ${formatter.format(compare)}</span>`
    : "";
  return `<div class="price">${compareHtml}<span>PKR ${formatter.format(product.sellingPricePkr)}</span></div>`;
}

function productCard(product) {
  const confirmation = product.requiresSupplierConfirmation
    ? `<p class="confirmation-note">Confirm details before ordering</p>`
    : "";
  return `
    <article class="glass-panel product-card" id="product-${escapeHtml(product.slug)}">
      <div class="product-top">
        <div class="logo-tile">
          <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.imageAltText)}" loading="lazy" width="32" height="32" onerror="this.remove()">
          <span aria-hidden="true">${escapeHtml(product.initials)}</span>
        </div>
        <span class="glass-panel badge">${product.requiresSupplierConfirmation ? "Confirm" : "Available"}</span>
      </div>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.shortDescription)}</p>
      <div class="meta-row">
        <span>${escapeHtml(product.category)}</span>
        <span>${escapeHtml(product.subscriptionDuration)}</span>
        <span>${escapeHtml(product.accessType)}</span>
        <span>${escapeHtml(product.creditsOrUsageLimit)}</span>
      </div>
      ${confirmation}
      ${priceHtml(product)}
      ${product.guideUrl ? `<a class="product-guide-link" href="${escapeHtml(product.guideUrl)}">View buying guide</a>` : ""}
      <div class="product-actions">
        <a class="button primary" target="_blank" rel="noopener" href="${whatsappLink(productMessage(product, "buy this plan"))}">Buy</a>
        <button class="button secondary glass-panel" type="button" data-details="${escapeHtml(product.slug)}">Details</button>
        <button class="mini-cart glass-panel" type="button" aria-label="Add ${escapeHtml(product.name)} to cart" data-add="${escapeHtml(product.slug)}">
          <svg viewBox="0 0 24 24"><path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.6L5 3H2"></path><path d="M9 21h.01M18 21h.01"></path></svg>
        </button>
      </div>
    </article>
  `;
}

function openDialog(html) {
  dialogContent.innerHTML = html;
  if (typeof detailDialog.showModal === "function") {
    detailDialog.showModal();
  } else {
    detailDialog.setAttribute("open", "");
  }
}

function productDetails(product) {
  const confirmation = product.requiresSupplierConfirmation
    ? `<p class="confirmation-note">Confirm details before ordering</p>`
    : "";
  openDialog(`
    <div class="dialog-product">
      <div class="logo-tile">
        <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.imageAltText)}" loading="lazy" width="32" height="32" onerror="this.remove()">
        <span aria-hidden="true">${escapeHtml(product.initials)}</span>
      </div>
      <div>
        <p class="eyebrow">${escapeHtml(product.category)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.planTier)}</p>
      </div>
    </div>
    <p class="dialog-note">${escapeHtml(product.fullDescription)}</p>
    ${confirmation}
    <dl class="detail-list">
      <div><dt>Price</dt><dd>PKR ${formatter.format(product.sellingPricePkr)}</dd></div>
      <div><dt>Base price</dt><dd>PKR ${formatter.format(product.basePricePkr)}</dd></div>
      <div><dt>Duration</dt><dd>${escapeHtml(product.subscriptionDuration)}</dd></div>
      <div><dt>Access</dt><dd>${escapeHtml(product.accessType)}</dd></div>
      <div><dt>Delivery</dt><dd>${escapeHtml(product.deliveryMethod)}</dd></div>
      <div><dt>Features</dt><dd>${escapeHtml(product.keyFeatures)}</dd></div>
    </dl>
    <div class="dialog-actions">
      <a class="button primary whatsapp-cta" target="_blank" rel="noopener" href="${whatsappLink(productMessage(product, "buy this plan"))}">Buy on WhatsApp</a>
    </div>
  `);
}

function cartDialog() {
  if (!cartItems.length) {
    openDialog("<h3>Cart</h3><p>Your cart is empty.</p>");
    return;
  }
  const items = cartItems.map((slug, index) => {
    const product = productBySlug.get(slug);
    return product ? `<li><span>${escapeHtml(product.name)}</span><button type="button" aria-label="Remove ${escapeHtml(product.name)}" data-remove-cart="${index}">Remove</button></li>` : "";
  }).join("");
  openDialog(`
    <h3>Cart</h3>
    <ul class="cart-list">${items}</ul>
    <div class="dialog-actions">
      <a class="button primary whatsapp-cta" target="_blank" rel="noopener" href="${whatsappLink(cartMessage())}">Send cart on WhatsApp</a>
      <button class="button secondary glass-panel" type="button" data-clear-cart>Clear cart</button>
    </div>
  `);
}

function renderCategories() {
  if (!categoryGrid) return;
  const categories = [...new Set(products.map((product) => product.category))];
  categoryGrid.innerHTML = categories.map((category) => `
    <button class="glass-panel category-card" type="button" data-category="${escapeHtml(category)}">
      ${escapeHtml(category)}
      <span>${escapeHtml(categoryDescriptions[category] || "AI tools and subscriptions")}</span>
    </button>
  `).join("");
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const haystack = [
      product.name,
      product.category,
      product.planTier,
      product.shortDescription,
      product.keyFeatures,
      product.fullDescription,
      product.subscriptionDuration,
      product.accessType,
      product.creditsOrUsageLimit
    ].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (!activeCategory || product.category === activeCategory);
  });
  productGrid.innerHTML = filtered.map(productCard).join("") || `<p class="notice glass-panel">No matching tools found.</p>`;
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === activeCategory);
  });
  document.querySelector("[data-clear-category]").hidden = !activeCategory;
}

document.addEventListener("click", (event) => {
  const whatsAppLink = event.target.closest('a[href^="https://wa.me/"]');
  if (whatsAppLink) {
    const now = Date.now();
    if (now - lastWhatsAppClick < 2500) {
      event.preventDefault();
      return;
    }
    lastWhatsAppClick = now;
  }

  const menuButton = event.target.closest("[data-menu-toggle]");
  if (menuButton) {
    const menu = document.querySelector("[data-mobile-menu]");
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    menuButton.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  }

  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const product = productBySlug.get(addButton.dataset.add);
    if (!product) return;
    cartItems.push(product.slug);
    saveCart();
    openDialog(`<h3>Added to cart</h3><p>${escapeHtml(product.name)} is now in your cart.</p><div class="dialog-actions"><button class="button secondary glass-panel" type="button" data-cart>View cart</button></div>`);
  }

  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) {
    const product = productBySlug.get(detailsButton.dataset.details);
    if (product) productDetails(product);
  }

  if (event.target.closest("[data-cart]")) {
    cartDialog();
  }

  if (event.target.closest("[data-clear-cart]")) {
    cartItems = [];
    saveCart();
    openDialog("<h3>Cart cleared</h3><p>Your cart is empty.</p>");
  }

  const removeButton = event.target.closest("[data-remove-cart]");
  if (removeButton) {
    cartItems.splice(Number(removeButton.dataset.removeCart), 1);
    saveCart();
    cartDialog();
  }

  if (event.target.closest("[data-close-dialog]")) {
    detailDialog.close();
  }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    activeCategory = activeCategory === categoryButton.dataset.category ? "" : categoryButton.dataset.category;
    renderProducts();
    document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" });
  }

  if (event.target.closest("[data-clear-category]")) {
    activeCategory = "";
    renderProducts();
  }

  if (event.target.closest("[data-open-search]")) {
    searchInput.focus();
  }

  if (event.target.closest("[data-mobile-menu] a")) {
    document.querySelector("[data-mobile-menu]").classList.remove("is-open");
    document.querySelector("[data-menu-toggle]").classList.remove("is-open");
    document.querySelector("[data-menu-toggle]").setAttribute("aria-expanded", "false");
  }
});

detailDialog.addEventListener("click", (event) => {
  if (event.target === detailDialog) {
    detailDialog.close();
  }
});

searchInput.addEventListener("input", renderProducts);

const initialQuery = new URLSearchParams(window.location.search).get("q");
if (initialQuery) searchInput.value = initialQuery.slice(0, 80);

document.querySelector("#finderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const need = String(data.get("need"));
  const budget = Number(data.get("budget"));
  const match = products.filter((product) => {
    const terms = `${product.category} ${product.planTier} ${product.name} ${product.shortDescription} ${product.keyFeatures}`.toLowerCase();
    return product.sellingPricePkr <= budget && terms.includes(need);
  }).sort((a, b) => a.sellingPricePkr - b.sellingPricePkr)[0];
  document.querySelector("#finderResult").textContent = match
    ? `${match.name} fits the budget at PKR ${formatter.format(match.sellingPricePkr)}. You can buy it on WhatsApp.`
    : "No match inside that budget. Raise the budget or contact support.";
});

document.querySelector("[data-floating-whatsapp]").href = whatsappLink("Hi AI Tools Pak, I need help choosing an AI tool.");
document.querySelector("[data-contact-whatsapp]").href = whatsappLink("Hi AI Tools Pak, I need help choosing an AI tool.");

document.querySelector("#requestForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#requestInput");
  const toolName = input.value.trim();
  if (!toolName) return;
  const message = [
    "Hi AI Tools Pak, I'd like to request an AI tool that isn't listed on the site:",
    "",
    `Requested Tool: ${toolName}`,
    "",
    "Please check availability and pricing for me. Thanks!"
  ].join("\n");
  window.open(whatsappLink(message), "_blank", "noopener");
  input.value = "";
});

document.querySelector("[data-product-count]").textContent = products.length;
renderCategories();
saveCart();
renderProducts();
