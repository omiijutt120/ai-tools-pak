(function () {
  const services = window.SOCIAL_MEDIA_SERVICES || [];
  const whatsappNumber = window.AI_TOOLS_CONFIG?.whatsappNumber || "923714549245";
  const formatter = new Intl.NumberFormat("en-PK");
  const platforms = ["All Services", "Instagram", "TikTok", "YouTube", "Facebook", "Telegram", "WhatsApp", "Twitter/X", "Spotify", "Other"];
  const state = {
    query: "",
    platform: "All Services",
    category: "",
    sort: "name",
    page: 1,
    perPage: 25
  };

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFKC")
      .replace(/tik\s*tok/gi, "TikTok")
      .replace(/\p{Extended_Pictographic}/gu, " ")
      .replace(/[^\p{L}\p{N}\s/+-]/gu, " ")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function displayPrice(service) {
    const price = Number(service.sellingRatePkr);
    if (service.matchStatus !== "exact" || !Number.isFinite(price) || price <= 0) {
      return "Confirm price on WhatsApp";
    }
    return `PKR ${formatter.format(price)} ${service.pricingBasis === "per_item" ? "per item" : "per 1,000"}`;
  }

  function calculateTotal(service, quantity) {
    const price = Number(service.sellingRatePkr);
    const count = Number(quantity);
    if (service.matchStatus !== "exact" || !Number.isFinite(price) || price <= 0 || !Number.isFinite(count) || count <= 0) {
      return null;
    }
    const raw = service.pricingBasis === "per_item" ? count * price : (count / 1000) * price;
    return Math.round(raw * 100) / 100;
  }

  function validateQuantity(service, quantity) {
    const count = Number(quantity);
    if (!Number.isFinite(count) || count <= 0) return "Enter a quantity greater than 0.";
    if (service.minQuantity && count < service.minQuantity) return `Minimum quantity is ${formatter.format(service.minQuantity)}.`;
    if (service.maxQuantity && count > service.maxQuantity) return `Maximum quantity is ${formatter.format(service.maxQuantity)}.`;
    return "";
  }

  function filterServices(serviceList, query, platform, category) {
    const normalizedQuery = normalizeText(query);
    return serviceList.filter((service) => {
      const matchesQuery = !normalizedQuery || service.searchText.includes(normalizedQuery);
      const matchesPlatform = platform === "All Services" || service.platform === platform;
      const matchesCategory = !category || service.category === category;
      return matchesQuery && matchesPlatform && matchesCategory;
    });
  }

  function sortServices(serviceList, sort) {
    return [...serviceList].sort((a, b) => {
      if (sort === "category") return `${a.category} ${a.serviceName}`.localeCompare(`${b.category} ${b.serviceName}`);
      if (sort === "price-asc" || sort === "price-desc") {
        const aPrice = Number.isFinite(Number(a.sellingRatePkr)) ? Number(a.sellingRatePkr) : Number.POSITIVE_INFINITY;
        const bPrice = Number.isFinite(Number(b.sellingRatePkr)) ? Number(b.sellingRatePkr) : Number.POSITIVE_INFINITY;
        return sort === "price-asc" ? aPrice - bPrice : bPrice - aPrice;
      }
      return a.serviceName.localeCompare(b.serviceName);
    });
  }

  function paginateServices(serviceList, page, perPage) {
    const totalPages = Math.max(1, Math.ceil(serviceList.length / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;
    return {
      page: safePage,
      totalPages,
      rows: serviceList.slice(start, start + perPage)
    };
  }

  function buildWhatsAppMessage(service, quantity, customerLink) {
    const total = calculateTotal(service, quantity);
    const estimatedTotal = total === null ? "Confirm on WhatsApp" : `PKR ${formatter.format(total)}`;
    const safeCustomerLink = service.sensitive
      ? "Manual support required - no credentials collected on website"
      : (customerLink || "Not provided");
    return [
      "Hello AI Tools Pak,",
      "",
      "I want to order a Social Media Service.",
      "",
      `Service: ${service.serviceName}`,
      `Service ID: ${service.catalogId}`,
      `Category: ${service.category}`,
      `Rate: ${displayPrice(service)}`,
      `Quantity: ${quantity}`,
      `Estimated Total: ${estimatedTotal}`,
      `Profile/Post/Video Link: ${safeCustomerLink}`,
      `Average Time: ${service.averageTime}`,
      "",
      "Please confirm availability and final order details."
    ].join("\n");
  }

  function whatsappUrl(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  window.SOCIAL_SERVICES_UTILS = {
    normalizeText,
    displayPrice,
    calculateTotal,
    filterServices,
    sortServices,
    paginateServices,
    buildWhatsAppMessage
  };

  const grid = document.querySelector("#serviceGrid");
  if (!grid) return;

  const count = document.querySelector("#socialServiceCount");
  // Keep the static platform starting-price cards in sync with the live catalog.
  // Guarded so non-DOM contexts (audit harness) and older browsers no-op safely.
  const minPriceNodes = document.querySelectorAll ? document.querySelectorAll("[data-min-price-pkr]") : [];
  if (minPriceNodes.length) {
    const minByPlatform = new Map();
    services.forEach((service) => {
      const platform = service.platform;
      if (!minByPlatform.has(platform) || service.sellingRatePkr < minByPlatform.get(platform)) {
        minByPlatform.set(platform, service.sellingRatePkr);
      }
    });
    minPriceNodes.forEach((node) => {
      const pkr = minByPlatform.get(node.getAttribute("data-platform"));
      if (pkr !== undefined) {
        node.textContent = displayPrice({ sellingRatePkr: pkr, matchStatus: "exact" });
      }
    });
  }
  const search = document.querySelector("#socialSearch");
  const platformFilters = document.querySelector("#platformFilters");
  const categoryFilter = document.querySelector("#categoryFilter");
  const sortSelect = document.querySelector("#socialSort");
  const perPageSelect = document.querySelector("#perPageSelect");
  const resultsSummary = document.querySelector("#resultsSummary");
  const pagination = document.querySelector("#paginationControls");
  const dialog = document.querySelector("#serviceDialog");
  const dialogContent = document.querySelector("#serviceDialogContent");
  const serviceById = new Map(services.map((service) => [service.catalogId, service]));

  function serviceCard(service) {
    const details = service.details ? `<p>${escapeHtml(service.details).slice(0, 220)}${service.details.length > 220 ? "..." : ""}</p>` : "<p>Details will be confirmed on WhatsApp.</p>";
    const defaultQuantity = service.pricingBasis === "per_item" ? 1 : 1000;
    const orderUrl = whatsappUrl(buildWhatsAppMessage(service, defaultQuantity, ""));
    return `
      <article class="glass-panel service-card">
        <div class="service-card-top">
          <span class="glass-panel badge">${escapeHtml(service.platform)}</span>
          <span class="service-id">${escapeHtml(service.catalogId)}</span>
        </div>
        <h3>${escapeHtml(service.serviceName)}</h3>
        ${details}
        <div class="meta-row">
          <span>${escapeHtml(service.category)}</span>
          <span>${escapeHtml(service.averageTime)}</span>
        </div>
        <div class="service-price">${escapeHtml(displayPrice(service))}</div>
        <div class="product-actions">
          <a class="button primary" target="_blank" rel="noopener noreferrer" href="${escapeHtml(orderUrl)}">Buy on WhatsApp</a>
          <button class="button secondary glass-panel" type="button" data-open-service="${escapeHtml(service.catalogId)}">Details</button>
        </div>
      </article>
    `;
  }

  function renderFilters() {
    platformFilters.innerHTML = platforms.map((platform) => `
      <button class="glass-panel platform-chip${platform === state.platform ? " is-active" : ""}" type="button" data-platform="${escapeHtml(platform)}">${escapeHtml(platform)}</button>
    `).join("");

    const categories = [...new Set(services.map((service) => service.category))].sort((a, b) => a.localeCompare(b));
    categoryFilter.innerHTML = `<option value="">All categories</option>${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}`;
  }

  function render() {
    const filtered = sortServices(filterServices(services, state.query, state.platform, state.category), state.sort);
    const page = paginateServices(filtered, state.page, state.perPage);
    state.page = page.page;
    grid.innerHTML = page.rows.map(serviceCard).join("") || `<div class="notice glass-panel">No services match your search.</div>`;
    resultsSummary.textContent = `${formatter.format(filtered.length)} services found from ${formatter.format(services.length)} total. Page ${page.page} of ${page.totalPages}.`;
    pagination.innerHTML = `
      <button class="button secondary glass-panel" type="button" data-page="prev" ${page.page === 1 ? "disabled" : ""}>Previous</button>
      <span>${page.page} / ${page.totalPages}</span>
      <button class="button secondary glass-panel" type="button" data-page="next" ${page.page === page.totalPages ? "disabled" : ""}>Next</button>
    `;
  }

  function openService(service) {
    const defaultQuantity = service.pricingBasis === "per_item" ? 1 : 1000;
    const warning = service.sensitive
      ? `<div class="notice warning-note glass-panel">This service may involve account access. Do not enter passwords, login details or 2FA codes on this website.</div>`
      : "";

    dialogContent.innerHTML = `
      <article class="dialog-product">
        <div class="logo-tile"><span>${escapeHtml(service.platform.slice(0, 2).toUpperCase())}</span></div>
        <h3>${escapeHtml(service.serviceName)}</h3>
        <p>${escapeHtml(service.details || "Details will be confirmed on WhatsApp.")}</p>
        ${warning}
        <div class="detail-list">
          <div><span>Service ID</span><strong>${escapeHtml(service.catalogId)}</strong></div>
          <div><span>Category</span><strong>${escapeHtml(service.category)}</strong></div>
          <div><span>Average time</span><strong>${escapeHtml(service.averageTime)}</strong></div>
          <div><span>Rate</span><strong>${escapeHtml(displayPrice(service))}</strong></div>
        </div>
        <div class="service-order-form">
          <label>Quantity
            <input id="serviceQuantity" type="number" min="1" step="1" value="${defaultQuantity}" inputmode="numeric">
          </label>
          <label>Profile/Post/Video Link
            <input id="customerLink" type="url" placeholder="${service.sensitive ? "Manual support - do not enter credentials" : "https://"}" ${service.sensitive ? "disabled" : ""}>
          </label>
          <output id="serviceEstimate">Estimated total: Confirm on WhatsApp</output>
          <p id="serviceError" class="form-error" aria-live="polite"></p>
        </div>
        <div class="dialog-actions">
          <a class="button primary" target="_blank" rel="noopener noreferrer" id="serviceWhatsApp">Buy on WhatsApp</a>
          <button class="button secondary glass-panel" type="button" data-close-service-dialog>Close</button>
        </div>
      </article>
    `;

    const quantityInput = dialogContent.querySelector("#serviceQuantity");
    const customerLinkInput = dialogContent.querySelector("#customerLink");
    const estimate = dialogContent.querySelector("#serviceEstimate");
    const error = dialogContent.querySelector("#serviceError");
    const whatsapp = dialogContent.querySelector("#serviceWhatsApp");

    function update() {
      const message = validateQuantity(service, quantityInput.value);
      const total = calculateTotal(service, quantityInput.value);
      error.textContent = message;
      estimate.textContent = `Estimated total: ${total === null ? "Confirm on WhatsApp" : `PKR ${formatter.format(total)}`}`;
      whatsapp.href = whatsappUrl(buildWhatsAppMessage(service, quantityInput.value, customerLinkInput.value.trim()));
      whatsapp.setAttribute("aria-disabled", message ? "true" : "false");
    }

    quantityInput.addEventListener("input", update);
    customerLinkInput.addEventListener("input", update);
    whatsapp.addEventListener("click", (event) => {
      update();
      if (error.textContent) event.preventDefault();
    });
    update();
    dialog.showModal();
  }

  count.textContent = formatter.format(services.length);
  renderFilters();
  render();

  search.addEventListener("input", () => {
    state.query = search.value;
    state.page = 1;
    render();
  });

  platformFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-platform]");
    if (!button) return;
    state.platform = button.dataset.platform;
    state.page = 1;
    renderFilters();
    render();
  });

  categoryFilter.addEventListener("change", () => {
    state.category = categoryFilter.value;
    state.page = 1;
    render();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });

  perPageSelect.addEventListener("change", () => {
    state.perPage = Number(perPageSelect.value);
    state.page = 1;
    render();
  });

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    state.page += button.dataset.page === "next" ? 1 : -1;
    render();
  });

  document.addEventListener("click", (event) => {
    const serviceButton = event.target.closest("[data-open-service]");
    if (serviceButton) {
      const service = serviceById.get(serviceButton.dataset.openService);
      if (service) openService(service);
    }
    if (event.target.closest("[data-close-service-dialog]")) dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}());
