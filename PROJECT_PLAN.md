# Ashirwaad Jewellery — Full-Stack E-Commerce Project Plan

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Neon PostgreSQL · Drizzle ORM · NextAuth.js · Zustand  
> **Deployment Target:** Vercel  
> **Repo:** `Vatsal-Patel-09/chirag-jewellery`

---

## Available Image Assets (carried over)

| Folder | Files | Usage |
|---|---|---|
| `images/logo/` | logo-ash.png | Header logo |
| `images/slider/` | 1.png, 2.jpg, 3.jpg | Hero carousel |
| `images/banner/` | 1.jpg, 2.jpg, banner2222.jpg, bg-1/2/3.jpg | Promo banners |
| `images/product/` | 1.jpg – 75.jpg (55 files) | Product images |
| `images/blog/` | 1.jpg – 4.jpg | Blog/article cards |
| `images/instagram/` | insta-1.jpg – insta-6.jpg | Instagram feed section |
| `images/icon/` | icon_phone.png, papyel2.png | UI icons |
| `images/nav-product/` | product.jpg, product2.jpg | Mega-menu thumbnails |

---

## Phase 0 — Project Scaffolding & Configuration

### Task 0.1 — Initialize Next.js Project
- Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- Confirm folder structure: `src/app/`, `src/components/`, `src/lib/`
- Move `images/` into `public/images/` so Next.js can serve them statically

### Task 0.2 — Install Core Dependencies
```
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
npm install next-auth@5 @auth/drizzle-adapter
npm install zustand
npm install bcryptjs
npm install -D @types/bcryptjs
npm install zod
npm install react-hot-toast
npm install lucide-react
npm install embla-carousel-react embla-carousel-autoplay
```

### Task 0.3 — Environment Variables
Create `.env.local`:
```env
DATABASE_URL=postgresql://...@ep-xxx.us-east-2.aws.neon.tech/ashirwaad?sslmode=require
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=http://localhost:3000
```
Add `.env.local` to `.gitignore`.

### Task 0.4 — Configure Drizzle ORM
- Create `src/lib/db/index.ts` — Neon connection via `@neondatabase/serverless`
- Create `drizzle.config.ts` at project root
- Add npm scripts: `"db:generate"`, `"db:migrate"`, `"db:push"`, `"db:studio"`

---

## Phase 1 — Database Schema

### Task 1.1 — Define Schema (`src/lib/db/schema.ts`)

**users**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default random |
| name | varchar(100) | NOT NULL |
| email | varchar(255) | UNIQUE, NOT NULL |
| password | text | bcrypt hash, NOT NULL |
| phone | varchar(15) | nullable |
| image | text | nullable (avatar URL) |
| role | enum('customer','admin') | default 'customer' |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

**categories**
| Column | Type | Notes |
|---|---|---|
| id | serial | PK |
| name | varchar(100) | UNIQUE, NOT NULL |
| slug | varchar(100) | UNIQUE, NOT NULL |
| image | text | nullable |
| description | text | nullable |

**products**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | varchar(200) | NOT NULL |
| slug | varchar(200) | UNIQUE, NOT NULL |
| description | text | |
| price | numeric(10,2) | NOT NULL |
| old_price | numeric(10,2) | nullable (for "was ₹X" display) |
| category_id | int | FK → categories.id |
| images | text[] | array of image paths |
| stock | int | default 0 |
| is_featured | boolean | default false |
| is_active | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

**addresses**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| full_name | varchar(100) | |
| phone | varchar(15) | |
| address_line1 | text | |
| address_line2 | text | nullable |
| city | varchar(100) | |
| state | varchar(100) | |
| pincode | varchar(10) | |
| is_default | boolean | default false |

**orders**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| address | jsonb | snapshot of shipping address |
| subtotal | numeric(10,2) | |
| shipping | numeric(10,2) | |
| total | numeric(10,2) | |
| status | enum('pending','confirmed','shipped','delivered','cancelled') | default 'confirmed' |
| created_at | timestamp | |
| updated_at | timestamp | |

**order_items**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| order_id | uuid | FK → orders.id |
| product_id | uuid | FK → products.id |
| quantity | int | |
| price | numeric(10,2) | price at time of order |

**cart_items**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| product_id | uuid | FK → products.id |
| quantity | int | default 1 |
| created_at | timestamp | |

**wishlist**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| product_id | uuid | FK → products.id |
| created_at | timestamp | |

### Task 1.2 — Run Initial Migration
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Task 1.3 — Create Seed Script (`src/lib/db/seed.ts`)
- Seed 6–8 categories (Rings, Necklaces, Earrings, Bracelets, Pendants, Bangles, Chains, Wedding)
- Seed 30–50 products mapped to `public/images/product/*.jpg`
- Seed 1 admin user (email: admin@ashirwaad.com)
- Add npm script: `"db:seed": "npx tsx src/lib/db/seed.ts"`

---

## Phase 2 — Authentication

### Task 2.1 — NextAuth.js v5 Setup
- Create `src/lib/auth.ts` — configure NextAuth with:
  - **CredentialsProvider** (email + password login)
  - **DrizzleAdapter** for session/user storage
  - JWT strategy (stateless sessions)
  - Callbacks: `jwt` (attach user id + role), `session` (expose id + role)

### Task 2.2 — Auth API Route
- Create `src/app/api/auth/[...nextauth]/route.ts` — export GET/POST handlers from auth config

### Task 2.3 — Sign Up API
- Create `src/app/api/auth/signup/route.ts`
  - POST: validate with Zod → check duplicate email → hash password with bcrypt → insert user → return success
  - Return proper error messages for duplicate emails, weak passwords, etc.

### Task 2.4 — Auth Middleware
- Create `src/middleware.ts`
  - Protected routes: `/account/*`, `/checkout`, `/orders/*`
  - Redirect unauthenticated users to `/login?callbackUrl=<intended_path>`
  - Admin routes: `/admin/*` — redirect non-admin users to `/`

### Task 2.5 — Auth Helper Hooks & Utilities
- Create `src/lib/auth-utils.ts`:
  - `getServerSession()` — wrapper for server components
  - `requireAuth()` — throw redirect if not logged in (for server actions)
- Create `src/hooks/use-current-user.ts` — client hook wrapping `useSession()`

---

## Phase 3 — Core Layout & UI Components

### Task 3.1 — Global Layout (`src/app/layout.tsx`)
- HTML metadata (title, description, favicon from logo)
- Font: Google Fonts — "Playfair Display" (headings) + "Inter" (body)
- Tailwind globals import
- Wrap children with: `SessionProvider`, `Toaster` (react-hot-toast), `CartProvider` (Zustand)

### Task 3.2 — Header Component (`src/components/layout/header.tsx`)
- **Top bar:** Contact info, social links
- **Main bar:** Logo (public/images/logo/logo-ash.png), search input, icon buttons (wishlist, cart with badge count, user dropdown)
- **Navigation bar:** Home, Shop, Categories (dropdown), About, Contact
- **Mobile:** Hamburger → slide-in drawer with all nav links
- **Auth-aware:** Show "Login / Register" when logged out; show user name + dropdown (My Account, Orders, Logout) when logged in
- **Cart badge:** Real-time item count from Zustand store

### Task 3.3 — Footer Component (`src/components/layout/footer.tsx`)
- 4-column grid: About Us, Quick Links, Customer Service, Contact Info
- Instagram feed strip using `public/images/instagram/insta-*.jpg`
- Copyright bar
- Responsive: stacks to 2-col on tablet, 1-col on mobile

### Task 3.4 — Reusable UI Components
Create under `src/components/ui/`:
| Component | Purpose |
|---|---|
| `button.tsx` | Styled button with variants (primary, outline, ghost, danger) and sizes |
| `input.tsx` | Form input with label, error message, icon support |
| `badge.tsx` | Status badges (order status, sale tag, new tag) |
| `card.tsx` | Generic card wrapper |
| `modal.tsx` | Accessible modal dialog |
| `skeleton.tsx` | Loading skeleton placeholders |
| `breadcrumb.tsx` | Breadcrumb navigation |
| `pagination.tsx` | Page navigation for product listings |
| `quantity-selector.tsx` | +/- quantity input for cart |
| `price-display.tsx` | Shows current price + strikethrough old price |
| `rating-stars.tsx` | Star rating display |
| `empty-state.tsx` | Illustrated empty states (empty cart, no orders, etc.) |

### Task 3.5 — Product Card Component (`src/components/product/product-card.tsx`)
- Image with hover zoom effect
- Category label
- Product name (truncated to 2 lines)
- Price display (current + old price with discount %)
- "Add to Cart" button
- Wishlist heart icon (toggle)
- "Sale" / "New" badge overlay
- Links to `/products/[slug]`

---

## Phase 4 — Landing Page (Homepage)

### Task 4.1 — Hero Carousel Section
- Full-width image carousel using `embla-carousel-react`
- Images from `public/images/slider/`
- Each slide: background image + overlay text (heading, subheading, CTA button)
- Auto-play with pause-on-hover
- Navigation dots + prev/next arrows
- Mobile-responsive (text scales down, images cover)

### Task 4.2 — Categories Showcase Section
- Section heading: "Shop by Category"
- Grid of category cards (image + name + "Shop Now" arrow)
- 4 columns on desktop, 2 on tablet, 2 on mobile (scrollable)
- Uses category images (can use banner images as placeholders)

### Task 4.3 — Featured Products Section
- Section heading: "Featured Collection"
- Grid of ProductCard components (8 products, `is_featured = true`)
- 4 columns desktop, 3 tablet, 2 mobile
- "View All" link to `/shop`
- Server component — fetches directly from DB

### Task 4.4 — Promotional Banners Section
- 2-column layout with banner images from `public/images/banner/`
- Each banner: image + overlay text + CTA
- Examples: "New Arrivals – Explore Now", "Wedding Collection – 20% Off"
- Full-width on mobile

### Task 4.5 — New Arrivals Section
- Horizontal scrollable product row or grid
- Latest 8 products sorted by `created_at DESC`
- ProductCard components with "New" badge

### Task 4.6 — Why Choose Us / Trust Section
- 4 feature cards in a row:
  - 🚚 Free Shipping over ₹999
  - 🔄 Easy 7-Day Returns
  - 💎 Certified Jewellery
  - 🔒 Secure Checkout
- Icons from Lucide React

### Task 4.7 — Blog/Articles Preview Section
- Section heading: "From Our Journal"
- 4 blog cards using `public/images/blog/1-4.jpg`
- Each card: image, date, title, short excerpt
- Static content (no blog CMS — just visual section)

### Task 4.8 — Instagram Feed Section
- Section heading: "Follow Us @ashirwaad"
- 6-column grid of instagram images (`public/images/instagram/`)
- Hover overlay with Instagram icon
- Links to Instagram profile

### Task 4.9 — Newsletter Section
- Full-width banner background
- "Subscribe to our Newsletter" heading
- Email input + Subscribe button (UI only — toast "Subscribed!" on submit)

---

## Phase 5 — Shop & Product Pages

### Task 5.1 — Shop Page (`src/app/shop/page.tsx`)
- **URL:** `/shop?category=rings&sort=price-asc&page=1&search=gold`
- **Layout:** Sidebar (desktop) / Filter drawer (mobile) + Product grid
- **Sidebar filters:**
  - Category checkboxes (fetched from DB)
  - Price range (predefined ranges: Under ₹5000, ₹5000–₹15000, ₹15000–₹30000, Above ₹30000)
  - Sort dropdown (Newest, Price Low→High, Price High→Low, Name A→Z)
- **Product grid:** ProductCard components, responsive (4/3/2 cols)
- **Pagination:** 12 products per page, numbered pagination
- **Search:** Search bar filters products by name
- **Breadcrumb:** Home > Shop (> Category Name if filtered)
- **Result count:** "Showing 1–12 of 48 products"
- **Server-side** data fetching with URL search params

### Task 5.2 — Product Detail Page (`src/app/products/[slug]/page.tsx`)
- **Image gallery:** Main image + thumbnails (click to swap). Use product images array.
- **Product info panel:**
  - Breadcrumb: Home > Shop > Category > Product Name
  - Product name (h1)
  - Price display (current + old price, discount %)
  - Short description
  - Stock status ("In Stock" green / "Out of Stock" red)
  - Quantity selector
  - "Add to Cart" button (disabled if out of stock)
  - "Add to Wishlist" button
- **Tabs below:**
  - Description (full text)
  - Shipping & Returns (static info)
- **Related Products:** 4 products from same category
- **Generate static params** for SSG + ISR (revalidate: 60)

### Task 5.3 — Search Results
- When user searches from header search bar, redirect to `/shop?search=<query>`
- Show "Search results for '<query>'" heading
- Reuses shop page with search filter active

---

## Phase 6 — Cart System

### Task 6.1 — Zustand Cart Store (`src/store/cart-store.ts`)
- State: `items[]`, `isOpen` (sidebar toggle)
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `toggleCart`
- Each item: `{ productId, name, price, image, quantity, stock }`
- Persist to `localStorage` via Zustand middleware
- Computed: `totalItems`, `subtotal`
- On login: sync localStorage cart to DB cart_items table
- On logout: clear store

### Task 6.2 — Cart Sidebar (`src/components/cart/cart-sidebar.tsx`)
- Slide-in from right, overlay background
- List of cart items: image thumbnail, name, price, quantity selector, remove button
- Subtotal at bottom
- "View Cart" and "Checkout" buttons
- Empty state when no items
- Trigger: clicking cart icon in header

### Task 6.3 — Cart Page (`src/app/cart/page.tsx`)
- Full page cart view
- Table/list layout: Image, Product Name, Price, Quantity (editable), Subtotal, Remove
- Order summary sidebar: Subtotal, Shipping (free over ₹999, else ₹99), Total
- "Continue Shopping" and "Proceed to Checkout" buttons
- Empty cart: illustration + "Start Shopping" CTA
- Mobile: card-style layout instead of table

### Task 6.4 — Cart Server Actions (`src/app/actions/cart.ts`)
- `syncCartToDB(userId, localItems)` — merge localStorage cart into DB on login
- `getCartFromDB(userId)` — fetch DB cart for logged-in user
- `addToCartDB(userId, productId, qty)`
- `removeFromCartDB(userId, productId)`
- `updateCartItemDB(userId, productId, qty)`
- `clearCartDB(userId)`

---

## Phase 7 — Checkout & Orders

### Task 7.1 — Checkout Page (`src/app/checkout/page.tsx`) — PROTECTED
- **Step 1: Shipping Address**
  - If user has saved addresses → show them as selectable cards
  - "Add New Address" form: Name, Phone, Address Line 1 & 2, City, State, Pincode
  - Save address checkbox
  - Zod validation on all fields
- **Step 2: Order Review**
  - List all cart items (read-only)
  - Selected address summary
  - Subtotal, Shipping, Total
- **Place Order** button
  - Server action: create order + order_items, decrement product stock, clear cart
  - All orders auto-confirmed (status = 'confirmed') — no payment step
  - Redirect to `/orders/[orderId]/success`

### Task 7.2 — Order Success Page (`src/app/orders/[id]/success/page.tsx`) — PROTECTED
- Confetti or checkmark animation
- "Order Confirmed!" heading
- Order ID display
- Order summary (items, total)
- "Continue Shopping" and "View Order" buttons

### Task 7.3 — Place Order Server Action (`src/app/actions/order.ts`)
- `placeOrder(userId, addressData, cartItems)`:
  1. Validate stock availability for all items
  2. Calculate totals server-side (never trust client prices)
  3. Insert into `orders` table (status: 'confirmed')
  4. Insert each item into `order_items`
  5. Decrement `products.stock` for each item
  6. Delete all `cart_items` for the user
  7. Return `{ orderId }` on success
- All DB operations in a transaction

---

## Phase 8 — User Account Pages (All PROTECTED)

### Task 8.1 — Account Layout (`src/app/account/layout.tsx`)
- Sidebar navigation: Dashboard, Orders, Addresses, Wishlist, Settings
- Mobile: horizontal scroll tabs
- Breadcrumb: Home > My Account > [Section]

### Task 8.2 — Account Dashboard (`src/app/account/page.tsx`)
- Welcome message with user name
- Quick stats cards: Total Orders, Wishlist Count
- Recent orders (last 3) with "View All" link
- Saved default address preview

### Task 8.3 — Orders Page (`src/app/account/orders/page.tsx`)
- List all user orders, newest first
- Each order card: Order ID (#short), date, item count, total, status badge
- Click → `/account/orders/[id]` detail page

### Task 8.4 — Order Detail Page (`src/app/account/orders/[id]/page.tsx`)
- Order status tracker (visual step indicator: Confirmed → Shipped → Delivered)
- Order items list: image, name, qty, price
- Shipping address
- Order total breakdown
- "Cancel Order" button (only if status = 'confirmed')

### Task 8.5 — Addresses Page (`src/app/account/addresses/page.tsx`)
- List saved addresses as cards
- "Set as Default" toggle
- Edit / Delete actions
- "Add New Address" button → inline form or modal
- Server actions for CRUD

### Task 8.6 — Wishlist Page (`src/app/account/wishlist/page.tsx`)
- Grid of wishlisted products (ProductCard with "Remove from Wishlist" instead of heart)
- "Add to Cart" button on each
- Empty state if no items
- Server actions: `addToWishlist`, `removeFromWishlist`, `getWishlist`

### Task 8.7 — Settings / Profile Page (`src/app/account/settings/page.tsx`)
- Edit profile form: Name, Phone, Email (read-only)
- Change Password: Current Password, New Password, Confirm
- Server actions with Zod validation + bcrypt verify/hash

---

## Phase 9 — Auth Pages (Public)

### Task 9.1 — Login Page (`src/app/login/page.tsx`)
- Clean centered card layout
- Email + Password fields
- "Remember me" checkbox
- Submit button with loading state
- Link to Sign Up page
- Error display (invalid credentials, etc.)
- Redirect to `callbackUrl` or `/` on success
- If already logged in, redirect to `/account`
- Use `signIn("credentials", ...)` from next-auth/react

### Task 9.2 — Sign Up Page (`src/app/signup/page.tsx`)
- Fields: Full Name, Email, Phone, Password, Confirm Password
- Zod validation (client-side + server-side)
- Password strength indicator
- Submit calls `/api/auth/signup` → auto login → redirect
- Link to Login page
- If already logged in, redirect to `/account`

---

## Phase 10 — Static / Info Pages

### Task 10.1 — About Page (`src/app/about/page.tsx`)
- Brand story section with image
- Mission / values
- Team or craftsmanship section
- Reuse banner images for visual appeal

### Task 10.2 — Contact Page (`src/app/contact/page.tsx`)
- Contact form: Name, Email, Subject, Message (UI only — toast on submit)
- Contact info sidebar: Phone, Email, Address
- Embedded Google Maps placeholder or static map image

### Task 10.3 — FAQ / Policies Pages
- `/shipping-policy` — Shipping info
- `/return-policy` — Return & refund info
- `/privacy-policy` — Privacy policy
- Simple markdown-style content pages with consistent layout

---

## Phase 11 — Admin Panel (PROTECTED — admin role only)

### Task 11.1 — Admin Layout (`src/app/admin/layout.tsx`)
- Sidebar: Dashboard, Products, Categories, Orders, Users
- Top bar with admin name + logout
- Role check: redirect non-admin to `/`
- Clean minimal design (separate from storefront)

### Task 11.2 — Admin Dashboard (`src/app/admin/page.tsx`)
- Stats cards: Total Revenue, Total Orders, Total Products, Total Users
- Recent orders table (last 10)
- Quick actions: Add Product, View Orders

### Task 11.3 — Products Management (`src/app/admin/products/page.tsx`)
- Table: Image thumbnail, Name, Category, Price, Stock, Status, Actions
- Search + filter by category
- Add Product page (`/admin/products/new`):
  - Form: Name, Slug (auto-generate), Description, Price, Old Price, Category (select), Stock, Images (file upload to `public/images/product/`), Featured toggle
- Edit Product page (`/admin/products/[id]/edit`)
- Delete Product (soft delete → `is_active = false`)

### Task 11.4 — Orders Management (`src/app/admin/orders/page.tsx`)
- Table: Order ID, Customer, Date, Total, Status, Actions
- Filter by status
- Click → Order detail → Update status dropdown (confirmed → shipped → delivered)
- Server action to update order status

### Task 11.5 — Categories Management (`src/app/admin/categories/page.tsx`)
- Table: Name, Slug, Product Count, Actions
- Add / Edit / Delete categories
- Simple form: Name, Slug, Image, Description

---

## Phase 12 — Polish, Performance & SEO

### Task 12.1 — Loading & Error States
- `loading.tsx` files for each route group with skeleton UIs
- `error.tsx` files with retry buttons
- `not-found.tsx` — custom 404 page with "Go Home" CTA

### Task 12.2 — SEO & Metadata
- Dynamic metadata for product pages (`generateMetadata`)
- Open Graph tags for social sharing
- `robots.txt` and `sitemap.xml` generation
- Structured data (JSON-LD) for products

### Task 12.3 — Image Optimization
- Use `next/image` everywhere with proper `width`, `height`, `alt`
- Set up `next.config.js` image domains
- Use blur placeholder for product images

### Task 12.4 — Performance Optimization
- React Server Components by default (minimize "use client")
- Dynamic imports for heavy components (carousel, modals)
- Proper cache headers + ISR for product pages
- Database query optimization with proper indexes

### Task 12.5 — Responsive Design Audit
- Test all pages at: 320px, 375px, 768px, 1024px, 1440px
- Fix any overflow, text wrapping, touch target issues
- Ensure all interactive elements are ≥ 44px touch targets on mobile

### Task 12.6 — Toast Notifications
- Add to Cart → "Added to cart!" toast
- Signup → "Account created!" toast
- Order placed → "Order confirmed!" toast
- Error states → red error toasts
- All via react-hot-toast

---

## Phase 13 — Deployment

### Task 13.1 — Pre-Deployment Checklist
- [ ] All environment variables documented
- [ ] Neon DB production branch created
- [ ] Migrations run on production DB
- [ ] Seed data loaded (categories + sample products)
- [ ] Admin user created
- [ ] Next.js build passes with no errors (`npm run build`)
- [ ] All pages tested manually

### Task 13.2 — Deploy to Vercel
- Connect GitHub repo to Vercel
- Set environment variables in Vercel dashboard:
  - `DATABASE_URL` (Neon production connection string)
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (production domain)
- Deploy and verify

### Task 13.3 — Post-Deployment
- Test full flow: Browse → Sign Up → Add to Cart → Checkout → View Order
- Monitor Vercel logs for errors
- Set up Neon DB auto-scaling if needed

---

## Execution Order Summary

| # | Phase | Tasks | Est. Complexity |
|---|---|---|---|
| 0 | Scaffolding & Config | 0.1 – 0.4 | Low |
| 1 | Database Schema | 1.1 – 1.3 | Medium |
| 2 | Authentication | 2.1 – 2.5 | Medium |
| 3 | Core Layout & UI | 3.1 – 3.5 | Medium |
| 4 | Landing Page | 4.1 – 4.9 | Medium |
| 5 | Shop & Products | 5.1 – 5.3 | High |
| 6 | Cart System | 6.1 – 6.4 | High |
| 7 | Checkout & Orders | 7.1 – 7.3 | High |
| 8 | User Account | 8.1 – 8.7 | Medium |
| 9 | Auth Pages | 9.1 – 9.2 | Low |
| 10 | Static Pages | 10.1 – 10.3 | Low |
| 11 | Admin Panel | 11.1 – 11.5 | High |
| 12 | Polish & SEO | 12.1 – 12.6 | Medium |
| 13 | Deployment | 13.1 – 13.3 | Low |

**Total Tasks: 54** | **Estimated Build Time: Senior dev solo — 5 to 7 focused sessions**

---

## File Structure (Target)

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (providers, fonts)
│   ├── page.tsx                    # Homepage
│   ├── loading.tsx                 # Global loading skeleton
│   ├── error.tsx                   # Global error boundary
│   ├── not-found.tsx               # 404 page
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts
│   │       └── signup/route.ts
│   ├── shop/
│   │   └── page.tsx                # Shop listing with filters
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx            # Product detail
│   ├── cart/
│   │   └── page.tsx                # Full cart page
│   ├── checkout/
│   │   └── page.tsx                # Checkout (protected)
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── account/
│   │   ├── layout.tsx              # Account sidebar layout
│   │   ├── page.tsx                # Dashboard
│   │   ├── orders/
│   │   │   ├── page.tsx            # All orders
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Order detail
│   │   ├── addresses/
│   │   │   └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── orders/
│   │   └── [id]/
│   │       └── success/
│   │           └── page.tsx        # Order confirmation
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── shipping-policy/
│   │   └── page.tsx
│   ├── return-policy/
│   │   └── page.tsx
│   └── privacy-policy/
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── search-bar.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── skeleton.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── pagination.tsx
│   │   ├── quantity-selector.tsx
│   │   ├── price-display.tsx
│   │   └── empty-state.tsx
│   ├── product/
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-gallery.tsx
│   │   └── product-filters.tsx
│   ├── cart/
│   │   ├── cart-sidebar.tsx
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── home/
│   │   ├── hero-carousel.tsx
│   │   ├── category-showcase.tsx
│   │   ├── featured-products.tsx
│   │   ├── promo-banners.tsx
│   │   ├── trust-badges.tsx
│   │   ├── blog-preview.tsx
│   │   ├── instagram-feed.tsx
│   │   └── newsletter.tsx
│   └── account/
│       ├── account-sidebar.tsx
│       ├── order-card.tsx
│       ├── address-card.tsx
│       └── address-form.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts                # Neon connection
│   │   ├── schema.ts               # Drizzle schema
│   │   ├── seed.ts                 # Seed script
│   │   └── migrations/             # Generated migrations
│   ├── auth.ts                     # NextAuth config
│   ├── auth-utils.ts               # Server auth helpers
│   └── utils.ts                    # Generic helpers (cn, formatPrice, slugify)
├── store/
│   └── cart-store.ts               # Zustand cart store
├── hooks/
│   ├── use-current-user.ts
│   └── use-debounce.ts
├── actions/
│   ├── cart.ts                     # Cart server actions
│   ├── order.ts                    # Order server actions
│   ├── product.ts                  # Product queries
│   ├── address.ts                  # Address CRUD
│   ├── wishlist.ts                 # Wishlist CRUD
│   └── admin.ts                    # Admin actions
└── types/
    └── index.ts                    # Shared TypeScript types
public/
├── images/                         # Existing image assets (moved here)
│   ├── banner/
│   ├── blog/
│   ├── icon/
│   ├── instagram/
│   ├── logo/
│   ├── nav-product/
│   ├── product/
│   └── slider/
└── favicon.ico
```

---

> **Ready to execute. Start with Phase 0, Task 0.1.**
