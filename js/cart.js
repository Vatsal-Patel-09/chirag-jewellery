/*  ============================================
    Cart Module
    ============================================
    Manages cart items in localStorage.
    Syncs to orders.json via GH_DB on checkout.
    ============================================ */

const Cart = (function () {
  const CART_KEY = "ashirwaad_cart";
  const ORDERS_FILE = "data/orders.json";

  // ── Get cart ──────────────────────────────────
  function getItems() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  // ── Save cart ─────────────────────────────────
  function save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartUI();
  }

  // ── Add item ──────────────────────────────────
  function addItem(product, qty) {
    qty = qty || 1;
    const items = getItems();
    const existing = items.find((i) => i.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty,
      });
    }

    save(items);
    return items;
  }

  // ── Remove item ───────────────────────────────
  function removeItem(productId) {
    const items = getItems().filter((i) => i.id !== productId);
    save(items);
    return items;
  }

  // ── Update quantity ───────────────────────────
  function updateQty(productId, qty) {
    const items = getItems();
    const item = items.find((i) => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      save(items);
    }
    return items;
  }

  // ── Clear cart ────────────────────────────────
  function clear() {
    localStorage.removeItem(CART_KEY);
    updateCartUI();
  }

  // ── Get total ─────────────────────────────────
  function getTotal() {
    return getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  // ── Get count ─────────────────────────────────
  function getCount() {
    return getItems().reduce((sum, i) => sum + i.qty, 0);
  }

  // ── Place order (writes to orders.json) ───────
  async function placeOrder(shippingInfo) {
    const user = Auth.getUser();
    if (!user) return { ok: false, msg: "Please login to place an order." };

    const items = getItems();
    if (items.length === 0) return { ok: false, msg: "Cart is empty." };

    const order = {
      id: "ord_" + Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: items,
      total: getTotal(),
      shipping: shippingInfo,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (GH_DB.isConfigured()) {
      const { content: orders, sha } = await GH_DB.read(ORDERS_FILE);
      orders.push(order);
      await GH_DB.write(ORDERS_FILE, orders, sha, `Order ${order.id} by ${user.email}`);
    } else {
      // Demo mode
      const stored = localStorage.getItem("demo_orders");
      const orders = stored ? JSON.parse(stored) : [];
      orders.push(order);
      localStorage.setItem("demo_orders", JSON.stringify(orders));
    }

    clear();
    return { ok: true, msg: "Order placed successfully!", orderId: order.id };
  }

  // ── Get user orders ───────────────────────────
  async function getOrders() {
    const user = Auth.getUser();
    if (!user) return [];

    let orders;
    if (GH_DB.isConfigured()) {
      const data = await GH_DB.read(ORDERS_FILE);
      orders = data.content;
    } else {
      const stored = localStorage.getItem("demo_orders");
      orders = stored ? JSON.parse(stored) : [];
    }

    return orders.filter((o) => o.userId === user.id);
  }

  // ── Update mini-cart UI in header ─────────────
  function updateCartUI() {
    const items = getItems();
    const total = getTotal();
    const count = getCount();

    // Update cart quantity badge
    const qtyBadge = document.querySelector(".cart_quantity");
    if (qtyBadge) qtyBadge.textContent = count;

    // Update cart total text
    const cartText = document.querySelector(".cart_text_quantity");
    if (cartText) cartText.textContent = "Rs. " + total.toLocaleString("en-IN");

    // Update mini-cart items
    const miniCart = document.querySelector(".mini_cart");
    if (!miniCart) return;

    // Remove old cart_item elements
    miniCart.querySelectorAll(".cart_item").forEach((el) => el.remove());
    const cartClose = miniCart.querySelector(".cart_close");

    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart_item";
      div.innerHTML = `
        <div class="cart_img">
          <a href="#"><img src="${getImgPath(item.image)}" alt="${item.name}"></a>
        </div>
        <div class="cart_info">
          <a href="#">${item.name}</a>
          <span class="quantity">Qty : ${item.qty}</span>
          <span class="price_cart">Rs. ${(item.price * item.qty).toLocaleString("en-IN")}</span>
        </div>
        <div class="cart_remove">
          <a href="#" data-remove-id="${item.id}"><i class="ion-android-close"></i></a>
        </div>
      `;
      cartClose.after(div);
    });

    // Update subtotal
    const cartTotal = miniCart.querySelector(".cart_total");
    if (cartTotal) {
      cartTotal.innerHTML = `
        <span>Subtotal : </span>
        <span>Rs. ${total.toLocaleString("en-IN")}</span>
      `;
    }

    // Bind remove buttons
    miniCart.querySelectorAll("[data-remove-id]").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        removeItem(this.dataset.removeId);
      });
    });
  }

  // Image path helper (adjusts for /pages/ subfolder)
  function getImgPath(src) {
    if (window.location.pathname.includes("/pages/")) {
      return "../" + src;
    }
    return src;
  }

  // Init on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateCartUI);
  } else {
    updateCartUI();
  }

  // ── Public API ────────────────────────────────
  return {
    getItems,
    addItem,
    removeItem,
    updateQty,
    clear,
    getTotal,
    getCount,
    placeOrder,
    getOrders,
    updateCartUI,
  };
})();
