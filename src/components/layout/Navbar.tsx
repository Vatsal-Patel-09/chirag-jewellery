"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Rings", slug: "rings" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Earrings", slug: "earrings" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Bangles", slug: "bangles" },
  { name: "Pendants", slug: "pendants" },
  { name: "Chains", slug: "chains" },
  { name: "Anklets", slug: "anklets" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((s) => s.getItemCount());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-stone-900 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <p className="hidden sm:block">Free shipping on orders above ₹5,000</p>
          <p className="sm:hidden text-center w-full">Free shipping above ₹5,000</p>
          <div className="hidden sm:flex items-center gap-4">
            <a href="tel:+919876543210" className="hover:text-amber-400 transition">
              +91 98765 43210
            </a>
            <span>|</span>
            <a href="mailto:info@chiragjewellery.com" className="hover:text-amber-400 transition">
              info@chiragjewellery.com
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-stone-700 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo/logo-ash.png"
              alt="Chirag Jewellery"
              width={160}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-stone-700 hover:text-amber-600 font-medium transition">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                href="/products"
                className="text-stone-700 hover:text-amber-600 font-medium transition flex items-center gap-1"
              >
                Shop <ChevronDown size={16} />
              </Link>
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-stone-100 py-3 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="block px-5 py-2.5 text-stone-600 hover:text-amber-600 hover:bg-stone-50 transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-stone-100 mt-2 pt-2">
                    <Link
                      href="/products"
                      className="block px-5 py-2.5 text-amber-600 font-medium hover:bg-stone-50 transition"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/products?sort=newest" className="text-stone-700 hover:text-amber-600 font-medium transition">
              New Arrivals
            </Link>
            <Link href="/products?featured=true" className="text-stone-700 hover:text-amber-600 font-medium transition">
              Featured
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-stone-700 hover:text-amber-600 transition p-2"
            >
              <Search size={20} />
            </button>

            {/* User */}
            <div
              className="relative"
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <button className="text-stone-700 hover:text-amber-600 transition p-2">
                <User size={20} />
              </button>
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-stone-100 py-3 z-50">
                  {session ? (
                    <>
                      <div className="px-5 py-2 border-b border-stone-100 mb-2">
                        <p className="font-medium text-stone-900">{session.user?.name}</p>
                        <p className="text-sm text-stone-500">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-5 py-2.5 text-stone-600 hover:text-amber-600 hover:bg-stone-50 transition"
                      >
                        <UserCircle size={18} /> My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-5 py-2.5 text-stone-600 hover:text-amber-600 hover:bg-stone-50 transition"
                      >
                        <Package size={18} /> My Orders
                      </Link>
                      {(session.user as any)?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-5 py-2.5 text-stone-600 hover:text-amber-600 hover:bg-stone-50 transition"
                        >
                          <LayoutDashboard size={18} /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-5 py-2.5 text-stone-600 hover:text-red-600 hover:bg-stone-50 transition w-full"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-5 py-2.5 text-stone-600 hover:text-amber-600 hover:bg-stone-50 transition"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block px-5 py-2.5 text-stone-600 hover:text-amber-600 hover:bg-stone-50 transition"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="text-stone-700 hover:text-amber-600 transition p-2 relative"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jewellery..."
              className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition"
            >
              Search
            </button>
          </form>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 hover:text-amber-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 hover:text-amber-600 font-medium"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 pl-4 text-stone-500 hover:text-amber-600"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products?sort=newest"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 hover:text-amber-600 font-medium"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
