const PRODUCTS = [
  {
    id: 1,
    name: "Colombia Supremo",
    price: 14.90,
    image: "img/cafe-colombia.png",
    category: "Origen único",
    description: "Un café equilibrado y redondo, con dulzor natural y una taza limpia pensada para disfrutar a diario.",
    badge: "BEST SELLER",
    origin: "Colombia",
    roast: "Medio",
    intensity: "Suave - media",
    notes: "Chocolate con leche, caramelo y fruta madura",
    idealFor: "Espresso, moka y preparaciones con leche",
    sizes: {
      "250g": 14.90,
      "500g": 27.60,
      "1kg": 52.20
    }
  },
  {
    id: 2,
    name: "Etiopía Natural",
    price: 16.50,
    image: "img/cafe-etiopia.png",
    category: "Origen único",
    description: "Una referencia más aromática y expresiva, con una taza elegante y un perfil muy definido.",
    badge: "LIMITED",
    origin: "Etiopía",
    roast: "Ligero",
    intensity: "Media",
    notes: "Floral, frutos rojos y cacao",
    idealFor: "Filtro, V60 y espresso suave",
    sizes: {
      "250g": 16.50,
      "500g": 30.50,
      "1kg": 57.90
    }
  },
  {
    id: 3,
    name: "Espresso House Blend",
    price: 13.90,
    image: "img/cafe-espresso.png",
    category: "Blend",
    description: "Mezcla creada para quienes buscan cuerpo, profundidad y regularidad en una taza intensa.",
    badge: "SIGNATURE",
    origin: "Blend propio",
    roast: "Medio - oscuro",
    intensity: "Alta",
    notes: "Cacao, caramelo tostado y frutos secos",
    idealFor: "Espresso y bebidas con leche",
    sizes: {
      "250g": 13.90,
      "500g": 25.70,
      "1kg": 48.50
    }
  },
  {
    id: 4,
    name: "Brasil Cerrado",
    price: 14.20,
    image: "img/cafe-brasil.png",
    category: "Origen único",
    description: "Café versátil y agradable, con un perfil suave y muy fácil de disfrutar en el día a día.",
    badge: "RECOMENDADO",
    origin: "Brasil",
    roast: "Medio",
    intensity: "Media",
    notes: "Cacao, nuez tostada y azúcar moreno",
    idealFor: "Consumo diario, espresso y prensa francesa",
    sizes: {
      "250g": 14.20,
      "500g": 26.30,
      "1kg": 49.90
    }
  }
];

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderDrawerCart();
}

function formatPrice(value) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

function getSubtotal() {
  return getCart().reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  const totalItems = getCart().reduce((acc, item) => acc + item.quantity, 0);
  countEl.textContent = totalItems;
}

function addToCart(productId, quantity = 1, size = "250g") {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const selectedPrice = product.sizes?.[size] || product.price;

  const existing = cart.find(item => item.id === productId && item.size === size);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: selectedPrice,
      image: product.image,
      size,
      quantity
    });
  }

  saveCart(cart);
  showToast(`${product.name} añadido al carrito`);
  openCartDrawer();
}

function removeFromCart(productId, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === productId && item.size === size));
  saveCart(cart);
  renderCart();
}

function updateCartItem(productId, size, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId && i.size === size);

  if (!item) return;

  item.quantity = Math.max(1, quantity);
  saveCart(cart);
  renderCart();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.right = "20px";
  toast.style.bottom = "20px";
  toast.style.background = "#1f1a17";
  toast.style.color = "#fff";
  toast.style.padding = "14px 18px";
  toast.style.borderRadius = "14px";
  toast.style.boxShadow = "0 12px 30px rgba(0,0,0,.18)";
  toast.style.zIndex = "9999";
  toast.style.fontWeight = "600";
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

async function loadPartials() {
  const headerTarget = document.getElementById("header-placeholder");
  const footerTarget = document.getElementById("footer-placeholder");

  if (headerTarget) {
    const res = await fetch("header.html");
    headerTarget.innerHTML = await res.text();
  }

  if (footerTarget) {
    const res = await fetch("footer.html");
    footerTarget.innerHTML = await res.text();
  }

  initMenu();
  initCartDrawer();
  updateCartCount();
  setActiveNav();
  renderDrawerCart();
}

function initMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".main-nav a");

  links.forEach(link => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });
}

function renderProductCards(products, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = products.map(product => `
    <article class="card product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}">
        <span class="badge">${product.badge}</span>
      </div>

      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="price-row">
          <span class="price">${formatPrice(product.price)}</span>
        </div>

        <div class="product-actions">
          <a class="btn btn-secondary" href="producto.html?id=${product.id}">Ver producto</a>
          <button class="btn btn-primary" onclick="addToCart(${product.id}, 1, '250g')">Añadir</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderFeaturedProducts(targetId = "featured-products") {
  renderProductCards(PRODUCTS, targetId);
}

function initShopFilters() {
  const pills = document.querySelectorAll(".filter-pill");
  const grid = document.getElementById("shop-products");
  const label = document.getElementById("product-count-label");

  if (!pills.length || !grid) return;

  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      const filter = pill.dataset.filter;
      const filtered = filter === "all"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === filter);

      renderProductCards(filtered, "shop-products");

      if (label) {
        label.textContent = `${filtered.length} producto${filtered.length !== 1 ? "s" : ""}`;
      }
    });
  });
}

function renderProductDetail() {
  const target = document.getElementById("product-detail-content");
  if (!target) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || 1;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const initialPrice = product.sizes?.["250g"] || product.price;

  target.innerHTML = `
    <div class="product-layout">
      <div class="product-gallery">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-panel">
        <span class="eyebrow">${product.category}</span>

        <h1>${product.name}</h1>

        <div class="product-rating">
          ★★★★★ <span class="rating-text">4.8 (124 reseñas)</span>
        </div>

        <p class="product-subtitle">${product.description}</p>

        <div class="price" id="dynamic-product-price">${formatPrice(initialPrice)}</div>

        <div class="product-meta">
          <div class="meta-box">
            <span>Origen</span>
            <strong>${product.origin}</strong>
          </div>

          <div class="meta-box">
            <span>Tueste</span>
            <strong>${product.roast}</strong>
          </div>

          <div class="meta-box">
            <span>Intensidad</span>
            <strong>${product.intensity}</strong>
          </div>

          <div class="meta-box">
            <span>Ideal para</span>
            <strong>${product.idealFor}</strong>
          </div>
        </div>

        <div class="info-card" style="padding:18px;margin:22px 0;border:1px solid var(--line);">
          <h3 style="margin-top:0;">Perfil en taza</h3>
          <p class="muted">${product.notes}</p>
        </div>

        <div class="form-row">
          <label for="size">Formato</label>
          <select id="size">
            <option value="250g">250g</option>
            <option value="500g">500g</option>
            <option value="1kg">1kg</option>
          </select>
        </div>

        <div class="form-row">
          <label for="qty">Cantidad</label>
          <div class="qty-wrap">
            <input id="qty" type="number" min="1" value="1">
          </div>
        </div>

        <button class="btn btn-primary" id="add-product-btn">Añadir al carrito</button>

        <p class="trust-line">✓ Envío en 24–48h · ✓ Pago seguro · ✓ Envío gratis desde 35€</p>

        <div class="info-card" style="padding:18px;margin-top:22px;border:1px solid var(--line);">
          <h3 style="margin-top:0;">Información adicional</h3>
          <ul class="check-list" style="margin-bottom:0;">
            <li>Envío en 24–48 horas laborables</li>
            <li>Packaging cuidado para una mejor conservación</li>
            <li>Envío gratuito a partir de 35 €</li>
            <li>Selección pensada para ofrecer calidad y consistencia en taza</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const sizeSelect = document.getElementById("size");
  const priceEl = document.getElementById("dynamic-product-price");
  const addBtn = document.getElementById("add-product-btn");

  if (sizeSelect && priceEl) {
    sizeSelect.addEventListener("change", () => {
      const selectedSize = sizeSelect.value;
      const selectedPrice = product.sizes?.[selectedSize] || product.price;
      priceEl.textContent = formatPrice(selectedPrice);
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = Number(document.getElementById("qty").value) || 1;
      const size = document.getElementById("size").value;
      addToCart(product.id, qty, size);
    });
  }
}

function renderCart() {
  const container = document.getElementById("cart-items-list");
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Tu carrito está vacío.</p>
        <a href="tienda.html" class="btn btn-primary">Ir a la tienda</a>
      </div>
    `;

    if (subtotalEl) subtotalEl.textContent = "0,00 €";
    if (shippingEl) shippingEl.textContent = "0,00 €";
    if (totalEl) totalEl.textContent = "0,00 €";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">

      <div>
        <h3>${item.name}</h3>
        <p>${item.size}</p>

        <div class="cart-item-controls">
          <input
            type="number"
            min="1"
            value="${item.quantity}"
            onchange="updateCartItem(${item.id}, '${item.size}', Number(this.value))"
          >

          <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">
            Eliminar
          </button>
        </div>
      </div>

      <div class="cart-item-price">
        ${formatPrice(item.price * item.quantity)}
      </div>
    </div>
  `).join("");

  const subtotal = getSubtotal();
  const shipping = subtotal >= 35 ? 0 : 4.90;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "Gratis" : formatPrice(shipping);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function renderDrawerCart() {
  const container = document.getElementById("drawer-cart-items");
  const totalEl = document.getElementById("drawer-cart-total");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `<p class="muted">Tu carrito está vacío.</p>`;
    if (totalEl) totalEl.textContent = "0,00 €";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="drawer-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>${item.size} · Cantidad: ${item.quantity}</p>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
      </div>
    </div>
  `).join("");

  if (totalEl) totalEl.textContent = formatPrice(getSubtotal());
}

function initCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const open = document.getElementById("openCartBtn");
  const close = document.getElementById("closeCartBtn");
  const overlay = document.getElementById("cartDrawerOverlay");

  if (!drawer) return;

  open?.addEventListener("click", openCartDrawer);
  close?.addEventListener("click", closeCartDrawer);
  overlay?.addEventListener("click", closeCartDrawer);
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  drawer?.classList.add("active");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  drawer?.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();

  renderFeaturedProducts();
  renderProductDetail();
  renderCart();

  const shopGrid = document.getElementById("shop-products");
  if (shopGrid) {
    renderFeaturedProducts("shop-products");
    initShopFilters();
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      localStorage.removeItem("cart");
      updateCartCount();
      renderDrawerCart();
      alert("Pedido confirmado correctamente.");
      window.location.href = "index.html";
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Mensaje enviado correctamente.");
      contactForm.reset();
    });
  }
});