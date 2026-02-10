/*  ============================================
    Authentication Module
    ============================================
    Sign-up, Login, Logout, Session management.
    Uses GH_DB (github-db.js) for persistence and
    localStorage for active session.
    ============================================ */

const Auth = (function () {
  const USERS_FILE = "data/users.json";
  const SESSION_KEY = "ashirwaad_user";

  // ── Hash password (SHA-256) ───────────────────
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // ── Sign-Up ───────────────────────────────────
  async function signUp(name, email, password, phone) {
    const { content: users, sha } = await GH_DB.read(USERS_FILE);

    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, msg: "An account with this email already exists." };
    }

    const hashed = await hashPassword(password);
    const newUser = {
      id: "usr_" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || "",
      password: hashed,
      createdAt: new Date().toISOString(),
      wishlist: [],
      addresses: [],
    };

    users.push(newUser);

    if (GH_DB.isConfigured()) {
      await GH_DB.write(USERS_FILE, users, sha, `New user: ${newUser.email}`);
    } else {
      // Demo mode – keep users only in localStorage
      localStorage.setItem("demo_users", JSON.stringify(users));
    }

    // Auto-login after signup
    setSession(newUser);
    return { ok: true, msg: "Account created successfully!" };
  }

  // ── Login ─────────────────────────────────────
  async function login(email, password) {
    let users;

    if (GH_DB.isConfigured()) {
      const data = await GH_DB.read(USERS_FILE);
      users = data.content;
    } else {
      // Demo mode
      const stored = localStorage.getItem("demo_users");
      users = stored ? JSON.parse(stored) : [];
    }

    const hashed = await hashPassword(password);
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === hashed
    );

    if (!user) {
      return { ok: false, msg: "Invalid email or password." };
    }

    setSession(user);
    return { ok: true, msg: "Login successful!" };
  }

  // ── Logout ────────────────────────────────────
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = getBasePath() + "index.html";
  }

  // ── Session helpers ───────────────────────────
  function setSession(user) {
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function getUser() {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  function isLoggedIn() {
    return getUser() !== null;
  }

  // ── Path helper (works from /pages/ or root) ──
  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes("/pages/")) return "../";
    return "";
  }

  // ── Update header UI on every page ────────────
  function updateHeaderUI() {
    const user = getUser();
    const base = getBasePath();

    // Desktop top-right links
    const topLinks = document.querySelector(".top_links");
    if (topLinks) {
      if (user) {
        topLinks.innerHTML = `
          <a href="${base}pages/my-account.html">
            <i class="ion-person"></i> ${user.name} <i class="ion-chevron-down"></i>
          </a>
          <ul class="dropdown_links">
            <li><a href="${base}pages/my-account.html">My Account</a></li>
            <li><a href="${base}pages/checkout.html">Checkout</a></li>
            <li><a href="#" id="header_logout">Logout</a></li>
          </ul>
        `;
        // Bind logout
        const logoutBtn = document.getElementById("header_logout");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            Auth.logout();
          });
        }
      } else {
        topLinks.innerHTML = `
          <a href="${base}pages/login.html">
            <i class="ion-log-in"></i> Login / Register
          </a>
        `;
      }
    }
  }

  // Auto-run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateHeaderUI);
  } else {
    updateHeaderUI();
  }

  // ── Public API ────────────────────────────────
  return { signUp, login, logout, getUser, isLoggedIn, getBasePath, updateHeaderUI };
})();
