# Chirag Jewellery — E-Commerce Website Execution Plan

> **Tech Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Neon DB (PostgreSQL) · Drizzle ORM · NextAuth.js v5 · Zustand (cart state)
>
> **Scope:** Full e-commerce flow — auth, product browsing, cart, checkout (auto-success, no payment gateway), order history, admin product management.

---

## Available Image Assets (Carried Over)

| Folder          | Files                                          | Usage Plan                          |
| --------------- | ---------------------------------------------- | ----------------------------------- |
| `images/banner` | 6 images (1.jpg, 2.jpg, banner2222.jpg, bg-*)  | Hero section, promotional banners   |
| `images/product`| 55 product images (1.jpg – 75.jpg)             | Product catalog & detail pages      |
| `images/slider` | 3 files (1.png, 2.jpg, 3.jpg)                  | Homepage carousel                   |
| `images/blog`   | 4 images (1–4.jpg)                             | Blog/editorial section on homepage  |
| `images/logo`   | logo-ash.png                                   | Site logo (navbar, footer, favicon) |
| `images/icon`   | icon_phone.png, papyel2.png                    | UI icons                            |
| `images/instagram` | 6 images (insta-1 – insta-6.jpg)            | Instagram feed section on homepage  |
| `images/nav-product` | product.jpg, product2.jpg                 | Navbar mega-menu product previews   |

---

## Phase 0 — Project Initialization & Tooling

### Task 0.1: Initialize Next.js Project
- Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` inside the project root.
- Ensure the `images/` folder is preserved (move to `public/images/` after init so Next.js can serve them statically).

### Task 0.2: Install Core Dependencies
```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
npm install next-auth@beta @auth/drizzle-adapter
npm install zustand
npm install bcryptjs
npm install -D @types/bcryptjs
npm install zod                   # form & API validation
npm install sonner                # toast notifications
npm install lucide-react          # icon library
npm install clsx tailwind-merge   # className utility
npm install @tanstack/react-query # server state / caching (optional but recommended)
```

### Task 0.3: Project Folder Structure Setup
Create the following directory scaffold:
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (shop)/
│   │   ├── page.tsx                 # homepage / landing
│   │   ├── products/
│   │   │   ├── page.tsx             # product listing
│   │   │   └── [slug]/page.tsx      # product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx        # protected
│   │   ├── checkout/success/page.tsx
│   │   ├── orders/page.tsx          # protected — order history
│   │   ├── orders/[id]/page.tsx     # protected — order detail
│   │   ├── account/page.tsx         # protected — profile
│   │   └── layout.tsx               # shop layout (navbar + footer)
│   ├── admin/
│   │   ├── page.tsx                 # dashboard
│   │   ├── products/page.tsx        # manage products
│   │   ├── products/new/page.tsx    # add product
│   │   ├── products/[id]/edit/page.tsx
│   │   ├── orders/page.tsx          # view all orders
│   │   └── layout.tsx               # admin sidebar layout
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/route.ts
│   │   ├── cart/route.ts
│   │   ├── orders/route.ts
│   │   └── admin/...
│   ├── layout.tsx                   # root layout
│   └── globals.css
├── components/
│   ├── ui/                          # reusable primitives (Button, Input, Card, Modal, Badge…)
│   ├── layout/                      # Navbar, Footer, Sidebar, MobileMenu
│   ├── home/                        # Hero, FeaturedProducts, Categories, InstagramFeed, BlogPreview
│   ├── product/                     # ProductCard, ProductGrid, ProductGallery, ProductInfo, FilterSidebar
│   ├── cart/                        # CartItem, CartSummary, CartDrawer
│   ├── checkout/                    # CheckoutForm, OrderSummary, AddressForm
│   └── admin/                       # AdminProductForm, AdminOrderTable, StatsCard
├── lib/
│   ├── db/
│   │   ├── index.ts                 # Neon DB connection (drizzle client)
│   │   ├── schema.ts               # ALL Drizzle table schemas
│   │   └── migrate.ts              # migration runner
│   ├── auth.ts                      # NextAuth config
│   ├── utils.ts                     # cn(), formatPrice(), slugify()…
│   └── validators.ts               # Zod schemas for forms & APIs
├── store/
│   └── cart-store.ts               # Zustand cart store
├── types/
│   └── index.ts                    # shared TS types/interfaces
├── middleware.ts                    # route protection
└── drizzle.config.ts               # Drizzle Kit config (project root)
```

### Task 0.4: Environment Variables
Create `.env.local`:
```env
DATABASE_URL=               # Neon DB connection string (pooled)
NEXTAUTH_SECRET=            # `openssl rand -base64 32`
NEXTAUTH_URL=http://localhost:3000
```
Create `.env.example` (same keys, empty values) and add `.env.local` to `.gitignore`.

### Task 0.5: Utility Helpers
Create `src/lib/utils.ts`:
- `cn()` — merges classnames via `clsx` + `tailwind-merge`.
- `formatPrice(amount: number)` — formats to ₹ / $ currency string.
- `slugify(text: string)` — generates URL-safe slugs.
- `generateOrderId()` — creates a readable order ID like `ORD-XXXXXX`.

---

## Phase 1 — Database Schema & ORM Setup

### Task 1.1: Neon DB Project Setup
- Create a Neon DB project at https://console.neon.tech.
- Copy the **pooled** connection string into `DATABASE_URL`.

### Task 1.2: Drizzle Config
Create `drizzle.config.ts` at project root:
```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

### Task 1.3: Define Database Schema (`src/lib/db/schema.ts`)
Design all tables upfront:

**users**
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   | `gen_random_uuid()`           |
| name           | varchar(255)|                               |
| email          | varchar(255)| UNIQUE, NOT NULL              |
| password       | text        | bcrypt hashed                 |
| role           | enum        | `customer` / `admin`          |
| phone          | varchar(20) | nullable                      |
| created_at     | timestamp   | default now()                 |
| updated_at     | timestamp   | default now()                 |

**addresses**
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   |                               |
| user_id        | uuid (FK)   | → users.id                    |
| full_name      | varchar(255)|                               |
| address_line1  | text        |                               |
| address_line2  | text        | nullable                      |
| city           | varchar(100)|                               |
| state          | varchar(100)|                               |
| postal_code    | varchar(20) |                               |
| country        | varchar(100)| default 'India'               |
| phone          | varchar(20) |                               |
| is_default     | boolean     | default false                 |

**categories**
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   |                               |
| name           | varchar(255)|                               |
| slug           | varchar(255)| UNIQUE                        |
| description    | text        | nullable                      |
| image_url      | text        | nullable                      |
| created_at     | timestamp   |                               |

**products**
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   |                               |
| name           | varchar(255)|                               |
| slug           | varchar(255)| UNIQUE                        |
| description    | text        |                               |
| price          | decimal(10,2)|                              |
| compare_at_price| decimal(10,2)| nullable (for "was ₹X")     |
| category_id    | uuid (FK)   | → categories.id               |
| images         | json        | array of image URLs           |
| stock          | integer     | default 0                     |
| is_featured    | boolean     | default false                 |
| is_active      | boolean     | default true                  |
| material       | varchar(100)| e.g. "Gold", "Silver"         |
| weight         | varchar(50) | e.g. "10g"                    |
| created_at     | timestamp   |                               |
| updated_at     | timestamp   |                               |

**cart_items**
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   |                               |
| user_id        | uuid (FK)   | → users.id                    |
| product_id     | uuid (FK)   | → products.id                 |
| quantity       | integer     | default 1                     |
| created_at     | timestamp   |                               |

**orders**
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   |                               |
| order_number   | varchar(20) | UNIQUE — human-readable ID    |
| user_id        | uuid (FK)   | → users.id                    |
| status         | enum        | `pending` / `confirmed` / `shipped` / `delivered` / `cancelled` |
| total          | decimal(10,2)|                              |
| shipping_address| json       | snapshot of address at order time |
| notes          | text        | nullable                      |
| created_at     | timestamp   |                               |
| updated_at     | timestamp   |                               |

**order_items**
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   |                               |
| order_id       | uuid (FK)   | → orders.id                   |
| product_id     | uuid (FK)   | → products.id                 |
| product_name   | varchar(255)| snapshot                      |
| product_image  | text        | snapshot                      |
| price          | decimal(10,2)| snapshot at time of order    |
| quantity       | integer     |                               |

**reviews** *(nice-to-have, include in schema now, build UI later)*
| Column         | Type        | Notes                         |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   |                               |
| user_id        | uuid (FK)   |                               |
| product_id     | uuid (FK)   |                               |
| rating         | integer     | 1–5                           |
| comment        | text        | nullable                      |
| created_at     | timestamp   |                               |

### Task 1.4: DB Connection Client
Create `src/lib/db/index.ts` — initialize Drizzle with `@neondatabase/serverless`.

### Task 1.5: Run Initial Migration
```bash
npx drizzle-kit generate
npx drizzle-kit push    # or migrate
```

### Task 1.6: Seed Script
Create `src/lib/db/seed.ts`:
- Insert 5–8 categories (Rings, Necklaces, Earrings, Bracelets, Bangles, Pendants, Chains, Anklets).
- Insert 30+ products using existing product images (`/images/product/1.jpg` … `/images/product/50.jpg`), distributing across categories.
- Insert 1 admin user (`admin@chirag.com` / hashed password).
- Add a `"db:seed"` script to `package.json`.

---

## Phase 2 — Authentication

### Task 2.1: NextAuth Configuration
Create `src/lib/auth.ts`:
- Use **Credentials provider** (email + password).
- Use **Drizzle adapter** for session/account tables (or JWT strategy — JWT is simpler for this project).
- On sign-in, verify bcrypt hash; return `{ id, name, email, role }`.
- Extend session type to include `role` and `id`.

### Task 2.2: Auth API Route
Create `src/app/api/auth/[...nextauth]/route.ts` — export GET & POST handlers from NextAuth.

### Task 2.3: Register API Route
Create `src/app/api/auth/register/route.ts`:
- Validate body with Zod (name, email, password, confirmPassword).
- Check if email exists → 409 Conflict.
- Hash password with bcrypt (salt 12).
- Insert user with role `customer`.
- Return 201 Created.

### Task 2.4: Register Page UI
`src/app/(auth)/register/page.tsx`:
- Form: Name, Email, Password, Confirm Password.
- Client-side Zod validation.
- Call register API → on success redirect to `/login`.
- Link to "Already have an account? Login".

### Task 2.5: Login Page UI
`src/app/(auth)/login/page.tsx`:
- Form: Email, Password.
- Call `signIn("credentials", { ... })`.
- Error toast on failure; redirect to `/` on success.
- Link to "Don't have an account? Register".

### Task 2.6: Auth Layout
`src/app/(auth)/layout.tsx`:
- Centered card layout, jewelry-themed background (use a banner image).
- Logo at top.

### Task 2.7: Middleware for Route Protection
`src/middleware.ts`:
- Protect: `/checkout`, `/orders`, `/account`, `/admin/*`.
- Redirect unauthenticated users to `/login?callbackUrl=...`.
- Redirect non-admin users away from `/admin/*` to `/`.

### Task 2.8: Auth Helpers & Hooks
- `src/lib/auth.ts` → `auth()` server-side helper to get current session.
- Create a `useCurrentUser()` client hook wrapping `useSession()`.

---

## Phase 3 — Layout Shell (Navbar + Footer)

### Task 3.1: Root Layout
`src/app/layout.tsx`:
- HTML skeleton, font setup (Inter + Playfair Display for headings), metadata.
- Wrap with `SessionProvider`, `Toaster` (sonner), QueryClientProvider if using react-query.

### Task 3.2: Navbar Component
`src/components/layout/Navbar.tsx`:
- **Top bar:** Phone number, email, social links.
- **Main bar:** Logo (from `/images/logo/logo-ash.png`), search input, user icon (dropdown: Login/Register or Profile/Orders/Logout), cart icon with badge (item count from Zustand store).
- **Nav links:** Home, Shop (with mega-menu showing categories + nav-product images), About, Contact.
- **Mobile:** Hamburger → slide-out drawer with all links.
- Sticky on scroll.

### Task 3.3: Footer Component
`src/components/layout/Footer.tsx`:
- 4-column grid: About Us, Quick Links, Customer Service, Contact Info.
- Newsletter email input (UI only for now).
- Social media links.
- Copyright bar at bottom.
- Instagram feed section above footer using `images/instagram/` images.

### Task 3.4: Shop Layout
`src/app/(shop)/layout.tsx`:
- Renders `<Navbar />` + `{children}` + `<Footer />`.

---

## Phase 4 — Landing Page (Homepage)

### Task 4.1: Hero Section
`src/components/home/Hero.tsx`:
- Full-width image slider using `images/slider/` images.
- Overlay text: tagline, CTA button → "Shop Now" linking to `/products`.
- Auto-play with manual navigation dots/arrows.
- Build a lightweight carousel (CSS scroll-snap or a small custom hook — no heavy library).

### Task 4.2: Category Showcase
`src/components/home/CategoryShowcase.tsx`:
- Grid of category cards (image + name + "Explore" link).
- Fetch categories from DB (server component).
- 4-column grid on desktop, 2-column on mobile.

### Task 4.3: Featured Products Section
`src/components/home/FeaturedProducts.tsx`:
- Heading: "Our Bestsellers" or "Featured Collection".
- Horizontal scrollable row or 4-column grid of `ProductCard` components.
- Fetch products where `is_featured = true` (server component).

### Task 4.4: Promotional Banner
`src/components/home/PromoBanner.tsx`:
- Split layout using `images/banner/` images.
- Text + CTA on one side, image on the other.
- Could showcase a sale, new collection, or brand story.

### Task 4.5: New Arrivals Section
`src/components/home/NewArrivals.tsx`:
- Latest 8 products sorted by `created_at DESC`.
- Grid of `ProductCard` components.

### Task 4.6: Trust/Features Bar
`src/components/home/TrustBar.tsx`:
- Horizontal bar with icons: Free Shipping, Certified Jewellery, 30-Day Returns, Secure Checkout.
- Use Lucide icons.

### Task 4.7: Blog/Editorial Section
`src/components/home/BlogPreview.tsx`:
- 4-card grid using `images/blog/` images.
- Static content for now (title, excerpt, "Read More" link to `#`).

### Task 4.8: Instagram Feed Section
`src/components/home/InstagramFeed.tsx`:
- 6-column grid of `images/instagram/` images.
- Hover overlay with Instagram icon.
- Heading: "Follow Us @chiragjewellery".

### Task 4.9: Assemble Homepage
`src/app/(shop)/page.tsx`:
- Compose all sections in order: Hero → TrustBar → CategoryShowcase → FeaturedProducts → PromoBanner → NewArrivals → BlogPreview → InstagramFeed.

---

## Phase 5 — Product Listing & Detail Pages

### Task 5.1: ProductCard Component
`src/components/product/ProductCard.tsx`:
- Image with hover zoom/second image effect.
- Product name, price (with compare_at_price strikethrough if present).
- "Add to Cart" button.
- Link wrapping card → `/products/[slug]`.
- Badge for "New" or "Sale" if applicable.

### Task 5.2: FilterSidebar Component
`src/components/product/FilterSidebar.tsx`:
- Category filter (checkboxes).
- Price range filter (min–max inputs or range slider).
- Material filter (Gold, Silver, Diamond, etc.).
- Sort dropdown (Price Low→High, High→Low, Newest, Name A–Z).
- Mobile: collapsible/drawer.

### Task 5.3: Product Listing Page
`src/app/(shop)/products/page.tsx`:
- Server component with searchParams for filters: `?category=rings&minPrice=500&maxPrice=5000&sort=price_asc&page=1`.
- Fetch filtered products from DB.
- Layout: FilterSidebar (left) + ProductGrid (right).
- Pagination component at bottom (12 products per page).
- Breadcrumbs: Home > Shop.
- Result count: "Showing 1–12 of 48 products".

### Task 5.4: Product Detail Page
`src/app/(shop)/products/[slug]/page.tsx`:
- **Product Gallery:** Main image + thumbnail strip (click to switch). Use product's `images` JSON array.
- **Product Info:** Name, price, compare_at_price, description, material, weight, stock status.
- **Quantity selector** + **"Add to Cart"** button.
- **Tabs or accordion:** Description, Additional Info, Reviews (placeholder).
- Breadcrumbs: Home > Shop > Category > Product Name.
- **Related Products:** 4 products from same category.

### Task 5.5: Products API Route
`src/app/api/products/route.ts`:
- GET: Query products with filters, pagination, sorting. Return JSON.
- Used as fallback for client-side filtering if needed.

### Task 5.6: Search Functionality
- Add search to navbar that navigates to `/products?search=query`.
- Server-side: `WHERE name ILIKE '%query%' OR description ILIKE '%query%'`.

---

## Phase 6 — Cart System

### Task 6.1: Zustand Cart Store
`src/store/cart-store.ts`:
- State: `items: CartItem[]` (productId, name, price, image, quantity, stock).
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getTotal`, `getItemCount`.
- Persist to `localStorage` via Zustand middleware for guest cart.

### Task 6.2: Cart Drawer (Side Panel)
`src/components/cart/CartDrawer.tsx`:
- Slides in from right when cart icon is clicked.
- Lists all cart items with image, name, price, quantity controls, remove button.
- Subtotal at bottom.
- "View Cart" and "Checkout" buttons.
- Empty state with "Continue Shopping" link.

### Task 6.3: Cart Page
`src/app/(shop)/cart/page.tsx`:
- Full-page cart view (table on desktop, cards on mobile).
- Each row: image, product name (linked), unit price, quantity selector, line total, remove.
- Cart summary sidebar: Subtotal, Shipping (free / calculated), Total.
- "Continue Shopping" + "Proceed to Checkout" buttons.
- Empty cart state.

### Task 6.4: Server-Side Cart Sync (for logged-in users)
`src/app/api/cart/route.ts`:
- GET: Fetch user's `cart_items` from DB (joined with product for current price/stock).
- POST: Add item to DB cart.
- PATCH: Update quantity.
- DELETE: Remove item.
- On login: merge localStorage cart with DB cart (client-side logic in auth callback).

---

## Phase 7 — Checkout & Orders

### Task 7.1: Checkout Page
`src/app/(shop)/checkout/page.tsx` — **Protected route**.
- **Step 1 — Shipping Address:**
  - If user has saved addresses, show them as selectable cards.
  - "Add New Address" form (Zod validated): full name, address lines, city, state, postal code, phone.
  - Save address to DB checkbox.
- **Step 2 — Order Review:**
  - List all items, quantities, prices.
  - Shipping address summary.
  - Order total.
- **Place Order** button.

### Task 7.2: Place Order API
`src/app/api/orders/route.ts` — POST:
- Validate user is authenticated.
- Validate all cart items are still in stock (re-check DB).
- Create `orders` row with status `confirmed`, snapshot shipping address as JSON.
- Create `order_items` rows (snapshot product name, image, price).
- Decrement `products.stock` for each item.
- Clear user's `cart_items`.
- Return `{ orderId, orderNumber }`.

### Task 7.3: Order Success Page
`src/app/(shop)/checkout/success/page.tsx`:
- "Order Placed Successfully!" with confetti or checkmark animation.
- Display order number.
- "View Order" button → `/orders/[id]`.
- "Continue Shopping" button → `/products`.
- Clear Zustand cart on this page load.

### Task 7.4: Orders History Page
`src/app/(shop)/orders/page.tsx` — **Protected**.
- List all user's orders sorted by date DESC.
- Each order card: Order #, date, status badge, total, item count.
- Click → order detail.

### Task 7.5: Order Detail Page
`src/app/(shop)/orders/[id]/page.tsx` — **Protected**.
- Order number, date, status (with visual timeline/stepper).
- Shipping address.
- Table of order items (image, name, qty, price).
- Order total breakdown.

---

## Phase 8 — User Account

### Task 8.1: Account Page
`src/app/(shop)/account/page.tsx` — **Protected**.
- Tabbed layout or sidebar navigation:
  - **Profile:** View/edit name, email, phone. Change password form.
  - **Addresses:** List saved addresses. Add/edit/delete. Set default.
  - **Orders:** Quick link to `/orders`.

### Task 8.2: Profile Update API
`src/app/api/account/route.ts`:
- PATCH: Update name, phone (Zod validated).
- PUT `/api/account/password`: Verify old password, hash new password, update.

### Task 8.3: Address CRUD API
`src/app/api/addresses/route.ts`:
- GET: Fetch user's addresses.
- POST: Add new address.
- PATCH `[id]`: Update address.
- DELETE `[id]`: Remove address.

---

## Phase 9 — Admin Panel

### Task 9.1: Admin Layout
`src/app/admin/layout.tsx`:
- Sidebar: Dashboard, Products, Orders, (Categories later).
- Top bar: Admin name, logout.
- Protected: only role `admin`.

### Task 9.2: Admin Dashboard
`src/app/admin/page.tsx`:
- Stats cards: Total Orders, Total Revenue, Total Products, Total Customers.
- Recent orders table (last 10).

### Task 9.3: Admin Products List
`src/app/admin/products/page.tsx`:
- Table: Image, Name, Category, Price, Stock, Status (Active/Inactive), Actions (Edit/Delete).
- Search + filter by category.
- "Add New Product" button.

### Task 9.4: Admin Product Create/Edit Form
`src/app/admin/products/new/page.tsx` & `src/app/admin/products/[id]/edit/page.tsx`:
- Form fields: Name (auto-generate slug), Description (textarea), Price, Compare-at-Price, Category (dropdown), Stock, Material, Weight, Is Featured, Is Active.
- Image management: Select from existing `/images/product/` images or upload URL.
- Zod validation.

### Task 9.5: Admin Products API
`src/app/api/admin/products/route.ts`:
- POST: Create product (admin only).
- PATCH `[id]`: Update product.
- DELETE `[id]`: Soft-delete (set `is_active = false`) or hard delete.

### Task 9.6: Admin Orders Management
`src/app/admin/orders/page.tsx`:
- Table: Order #, Customer, Date, Status, Total, Actions.
- Click to view order detail.
- Update order status dropdown (pending → confirmed → shipped → delivered).

### Task 9.7: Admin Orders API
`src/app/api/admin/orders/route.ts`:
- GET: List all orders (with pagination, filters).
- PATCH `[id]`: Update order status.

---

## Phase 10 — UI Polish & Responsive Design

### Task 10.1: Tailwind Theme Configuration
`tailwind.config.ts`:
- Define brand colors (gold, dark, cream/off-white palette suitable for jewellery).
- Custom fonts: serif heading font (Playfair Display), clean body font (Inter).
- Add animation keyframes for fade-in, slide-up, etc.

### Task 10.2: Reusable UI Components
Build in `src/components/ui/`:
- `Button` (variants: primary, secondary, outline, ghost, destructive; sizes: sm, md, lg).
- `Input` & `Textarea` (with label, error message support).
- `Select` (styled dropdown).
- `Card` (generic wrapper).
- `Badge` (status badges, product badges).
- `Modal` / `Dialog`.
- `Skeleton` (loading placeholders).
- `Breadcrumbs`.
- `Pagination`.
- `EmptyState` (icon + message + CTA).
- `Spinner` / loading indicator.

### Task 10.3: Loading & Error States
- Add `loading.tsx` files for key routes (products, orders, admin).
- Use Skeleton components for content loading.
- Add `error.tsx` boundaries for error handling.
- Add `not-found.tsx` for 404 pages.

### Task 10.4: Responsive Audit
- Test every page at: 375px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop).
- Ensure navbar mobile menu works.
- Ensure product grid reflows correctly.
- Ensure checkout form is mobile-friendly.
- Ensure admin panel is usable on tablet+.

### Task 10.5: Animations & Micro-Interactions
- Page transition fade-ins.
- Product card hover effects (image zoom, shadow lift).
- Add-to-cart button feedback (brief animation/color change).
- Toast notifications for: add to cart, login success, order placed, errors.

---

## Phase 11 — SEO, Metadata & Performance

### Task 11.1: Metadata
- Root `layout.tsx`: default title, description, OG tags.
- Per-page metadata via `generateMetadata()`: product pages get product name + image as OG.
- Favicon from logo.

### Task 11.2: Image Optimization
- Use `<Image />` from `next/image` everywhere.
- Define `images.remotePatterns` in `next.config.ts` if using external URLs.
- Add `sizes` and `priority` props appropriately.

### Task 11.3: Performance
- Use React Server Components by default; add `"use client"` only where needed.
- Implement `Suspense` boundaries around data-fetching sections.
- Use `dynamic()` import for heavy client components (e.g., image carousel).

---

## Phase 12 — Testing & Deployment Prep

### Task 12.1: Manual QA Checklist
- [ ] Register new account → verify in DB.
- [ ] Login → session persists across refresh.
- [ ] Browse products → filters work → pagination works.
- [ ] View product detail → images switch → related products load.
- [ ] Add to cart (guest) → cart persists in localStorage.
- [ ] Add to cart (logged in) → cart syncs to DB.
- [ ] Checkout → address form validates → order placed → success page.
- [ ] Order appears in order history with correct details.
- [ ] Admin login → dashboard stats → manage products (CRUD) → update order status.
- [ ] Protected routes redirect to login.
- [ ] Non-admin cannot access `/admin`.
- [ ] Mobile responsive on all pages.
- [ ] All toast notifications appear correctly.

### Task 12.2: Environment & Build
- Run `npm run build` — fix any build errors.
- Test production build locally: `npm start`.
- Ensure all env variables work in production mode.

### Task 12.3: Deployment (Vercel)
- Push to GitHub.
- Connect repo to Vercel.
- Add environment variables in Vercel dashboard.
- Deploy.
- Test production URL end-to-end.

---

## Execution Order Summary

| #  | Phase                        | Est. Effort | Dependencies         |
|----|------------------------------|-------------|----------------------|
| 0  | Project Init & Tooling       | 30 min      | —                    |
| 1  | Database Schema & ORM        | 1–2 hrs     | Phase 0              |
| 2  | Authentication               | 2–3 hrs     | Phase 1              |
| 3  | Layout Shell (Nav + Footer)  | 2–3 hrs     | Phase 0              |
| 4  | Landing Page                 | 3–4 hrs     | Phase 3, 1           |
| 5  | Product Listing & Detail     | 3–4 hrs     | Phase 1, 3           |
| 6  | Cart System                  | 2–3 hrs     | Phase 5              |
| 7  | Checkout & Orders            | 3–4 hrs     | Phase 2, 6           |
| 8  | User Account                 | 1–2 hrs     | Phase 2              |
| 9  | Admin Panel                  | 3–4 hrs     | Phase 1, 2           |
| 10 | UI Polish & Responsive       | 2–3 hrs     | All above            |
| 11 | SEO & Performance            | 1–2 hrs     | All above            |
| 12 | Testing & Deployment         | 1–2 hrs     | All above            |
|    | **Total Estimated**          | **~25–35 hrs** |                   |

---

## Notes & Decisions

1. **No payment gateway** — orders auto-confirm on checkout. Payment integration can be added later (Razorpay/Stripe) by hooking into the checkout flow.
2. **JWT sessions** over database sessions — simpler, no extra session table needed, works well with middleware.
3. **Zustand for cart** — client-side state with localStorage persistence for guests; syncs to DB for logged-in users.
4. **Static images** — existing product images are used via `public/images/`. No image upload feature needed initially; admin selects from available images.
5. **Admin creation** — seeded via the seed script. No public admin registration.
6. **Reviews** — schema defined now, UI deferred. Can be built as a follow-up phase.
7. **Drizzle ORM** — chosen over Prisma for better edge runtime compatibility with Neon's serverless driver and lighter bundle size.

---

*This document serves as the single source of truth for project execution. Tasks will be completed sequentially by phase, with each task verified before moving to the next.*
