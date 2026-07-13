const WHATSAPP_NUMBER = "923714549245";
const CART_KEY = "ai-tools-pak-cart";
const logo = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

const products = [
  { name: "ElevenLabs Creator", category: "AI Voice", plan: "Creator plan", duration: "3 months", access: "Private access", credits: "300K+ credits", price: 3000, initials: "EL", image: logo("elevenlabs.io") },
  { name: "Gemini Pro", category: "AI Assistants", plan: "Pro plan", duration: "18 months", access: "Private access", credits: "Google AI access", price: 720, initials: "GP", image: logo("gemini.google.com") },
  { name: "Runway ML", category: "AI Video", plan: "Video generation plan", duration: "Flexible plan", access: "Private access", credits: "Video generation tools", price: 2520, initials: "RM", image: logo("runwayml.com") },
  { name: "Leonardo AI", category: "AI Images and Design", plan: "Design plan", duration: "Flexible plan", access: "Private access", credits: "Image generation tools", price: 1200, initials: "LA", image: logo("leonardo.ai") },
  { name: "ChatGPT Plus", category: "AI Assistants", plan: "Plus plan", duration: "Flexible plan", access: "Private access", credits: "Advanced AI assistant", price: 1200, initials: "CG", image: logo("chatgpt.com") },
  { name: "Claude AI", category: "Development and Coding", plan: "AI assistant plan", duration: "Flexible plan", access: "Private access", credits: "Writing and coding assistant", price: 2399, initials: "CL", image: logo("claude.ai") },
  { name: "Lovable AI Pro", category: "Development and Coding", plan: "Pro plan", duration: "Flexible plan", access: "Private access", credits: "Monthly and daily credits", price: 1644, initials: "LV", image: logo("lovable.dev") },
  { name: "Grammarly Premium", category: "Writing and SEO", plan: "Premium plan", duration: "Flexible plan", access: "Private access", credits: "Grammar and writing tools", price: 959, initials: "GR", image: logo("grammarly.com") },
  { name: "QuillBot", category: "Writing and SEO", plan: "Writing plan", duration: "Flexible plan", access: "Private access", credits: "Paraphrasing and writing tools", price: 479, initials: "QB", image: logo("quillbot.com") },
  { name: "Success.ai Starter", category: "Marketing and Lead Generation", plan: "Starter leads", duration: "Flexible plan", access: "Private access", credits: "2,000 contacts", price: 2400, initials: "SA", image: logo("success.ai") },
  { name: "HeyGen AI", category: "AI Video", plan: "Video plan", duration: "Flexible plan", access: "Private access", credits: "Avatars and text-to-video", price: 1800, initials: "HG", image: logo("heygen.com") },
  { name: "Ideogram AI Plus", category: "AI Images and Design", plan: "Plus plan", duration: "Flexible plan", access: "Private access", credits: "AI image design tools", price: 4200, initials: "ID", image: logo("ideogram.ai") }
];

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const cartCount = document.querySelector("#cartCount");
const detailDialog = document.querySelector("#detailDialog");
const dialogContent = document.querySelector("#dialogContent");
const formatter = new Intl.NumberFormat("en-PK");
let cartItems = loadCart();
let activeCategory = "";
let lastWhatsAppClick = 0;

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function productMessage(product, intent) {
  return [
    `Hi AI Tools Pak, I want to ${intent}:`,
    `Product: ${product.name}`,
    `Plan: ${product.plan}`,
    `Price: PKR ${formatter.format(product.price)}`,
    `Duration: ${product.duration}`
  ].join("\n");
}

function cartMessage() {
  const lines = cartItems.map((name, index) => `${index + 1}. ${name}`);
  return [`Hi AI Tools Pak, I want to order these items:`, ...lines, `Total items: ${cartItems.length}`].join("\n");
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  cartCount.textContent = cartItems.length;
}

function productCard(product) {
  return `
    <article class="glass-panel product-card">
      <div class="product-top">
        <div class="logo-tile">
          <img src="${product.image}" alt="${product.name} logo" loading="lazy" onerror="this.remove()">
          <span aria-hidden="true">${product.initials}</span>
        </div>
        <span class="glass-panel badge">Available</span>
      </div>
      <h3>${product.name}</h3>
      <p>${product.plan}</p>
      <div class="meta-row">
        <span>${product.duration}</span>
        <span>${product.access}</span>
        <span>${product.credits}</span>
      </div>
      <div class="price">PKR ${formatter.format(product.price)}</div>
      <div class="product-actions">
        <button class="button secondary glass-panel" type="button" data-details="${product.name}">View Details</button>
        <button class="mini-cart glass-panel" type="button" aria-label="Add ${product.name} to cart" data-add="${product.name}">
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
  const intent = "buy this plan";
  openDialog(`
    <div class="dialog-product">
      <div class="logo-tile">
        <img src="${product.image}" alt="${product.name} logo" loading="lazy" onerror="this.remove()">
        <span aria-hidden="true">${product.initials}</span>
      </div>
      <div>
        <p class="eyebrow">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.plan}</p>
      </div>
    </div>
    <dl class="detail-list">
      <div><dt>Price</dt><dd>PKR ${formatter.format(product.price)}</dd></div>
      <div><dt>Duration</dt><dd>${product.duration}</dd></div>
      <div><dt>Credits / limits</dt><dd>${product.credits}</dd></div>
    </dl>
    <p class="dialog-note">Message us on WhatsApp to place your order.</p>
    <div class="dialog-actions">
      <a class="button primary whatsapp-cta" target="_blank" rel="noopener" href="${whatsappLink(productMessage(product, intent))}">Buy on WhatsApp</a>
    </div>
  `);
}

function cartDialog() {
  if (!cartItems.length) {
    openDialog("<h3>Cart</h3><p>Your cart is empty.</p>");
    return;
  }
  openDialog(`
    <h3>Cart</h3>
    <ul class="cart-list">${cartItems.map((item, index) => `<li><span>${item}</span><button type="button" aria-label="Remove ${item}" data-remove-cart="${index}">Remove</button></li>`).join("")}</ul>
    <div class="dialog-actions">
      <a class="button primary whatsapp-cta" target="_blank" rel="noopener" href="${whatsappLink(cartMessage())}">Send cart on WhatsApp</a>
      <button class="button secondary glass-panel" type="button" data-clear-cart>Clear cart</button>
    </div>
  `);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const haystack = `${product.name} ${product.category} ${product.plan}`.toLowerCase();
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
    const product = products.find((item) => item.name === addButton.dataset.add);
    cartItems.push(product.name);
    saveCart();
    openDialog(`<h3>Added to cart</h3><p>${product.name} is now in your cart.</p><div class="dialog-actions"><button class="button secondary glass-panel" type="button" data-cart>View cart</button></div>`);
  }

  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) {
    productDetails(products.find((item) => item.name === detailsButton.dataset.details));
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

document.querySelector("#finderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const need = data.get("need");
  const budget = Number(data.get("budget"));
  const match = products.find((product) => {
    const terms = `${product.category} ${product.plan} ${product.name}`.toLowerCase();
    return product.price <= budget && terms.includes(String(need));
  });
  document.querySelector("#finderResult").textContent = match
    ? `${match.name} fits the budget. You can buy it on WhatsApp.`
    : "No match inside that budget. Raise the budget or contact support.";
});

document.querySelector("[data-floating-whatsapp]").href = whatsappLink("Hi AI Tools Pak, I need help choosing an AI tool.");
document.querySelector("[data-contact-whatsapp]").href = whatsappLink("Hi AI Tools Pak, I need help choosing an AI tool.");
saveCart();
renderProducts();
