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
  ChevronRight,
  LogOut,
  Package,
  UserCircle,
  LayoutDashboard,
  Heart,
  Phone,
  Mail,
  Truck,
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100/50 transition-all duration-300">
      {/* Enhanced Top bar */}
      <div className="bg-stone-900 text-stone-200 text-xs tracking-wide py-2.5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <p className="hidden sm:flex items-center gap-2 font-medium">
            <span>Complimentary shipping on orders over ₹5,000</span>
          </p>
          <p className="sm:hidden text-center w-full flex items-center justify-center gap-2 font-medium">
            <span>Free shipping orders over ₹5,000</span>
          </p>
          <div className="hidden sm:flex items-center gap-6">
            <a href="tel:+919876543210" className="hover:text-white transition flex items-center gap-2">
              <Phone size={12} />
              +91 98765 43210
            </a>
            <a href="mailto:info@chiragjewellery.com" className="hover:text-white transition flex items-center gap-2">
              <Mail size={12} />
              info@ashirwaadjewellert.com
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Main navbar */}
      <nav className="max-w-7xl mx-auto px-6 md:px-12 py-5">
        <div className="flex items-center justify-between gap-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-stone-800 hover:text-amber-700 p-2 -ml-2 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <Image
              src="/images/logo/logo-ash.png"
              alt="Chirag Jewellery"
              width={160}
              height={50}
              className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-stone-800 hover:text-amber-700 text-sm font-medium tracking-wide transition-colors uppercase">
              Home
            </Link>
            <div
              className="relative group"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                href="/products"
                className="text-stone-800 hover:text-amber-700 text-sm font-medium tracking-wide transition-colors uppercase flex items-center gap-1 py-4"
              >
                Shop 
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>
              {shopDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-80 bg-white shadow-xl border border-stone-100 py-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 bg-white border-t border-l border-stone-100 rotate-45"></div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 px-6 relative bg-white">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className="text-sm text-stone-600 hover:text-amber-700 hover:pl-1 transition-all"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-stone-100 mt-4 pt-4 px-6 relative bg-white">
                    <Link
                      href="/products"
                      className="text-sm text-amber-700 font-medium hover:text-amber-800 flex items-center justify-between group/link"
                    >
                      <span>View All Collections</span>
                      <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/products?sort=newest" className="text-stone-800 hover:text-amber-700 text-sm font-medium tracking-wide transition-colors uppercase">
              New Arrivals
            </Link>
            <Link href="/products?featured=true" className="text-stone-800 hover:text-amber-700 text-sm font-medium tracking-wide transition-colors uppercase">
              Featured
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-stone-800 hover:text-amber-700 hover:bg-stone-50 transition-all p-2 rounded-full"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* User */}
            <div
              className="relative"
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <button className="text-stone-800 hover:text-amber-700 hover:bg-stone-50 transition-all p-2 rounded-full" aria-label="User menu">
                <User size={20} strokeWidth={1.5} />
              </button>
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-xl border border-stone-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {session ? (
                    <>
                      <div className="px-5 py-3 border-b border-stone-100 mb-2">
                        <p className="font-serif font-medium text-stone-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-stone-500 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-5 py-2 text-sm text-stone-600 hover:text-amber-700 hover:bg-stone-50 transition-colors"
                      >
                        <UserCircle size={16} /> <span>My Account</span>
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-5 py-2 text-sm text-stone-600 hover:text-amber-700 hover:bg-stone-50 transition-colors"
                      >
                        <Package size={16} /> <span>My Orders</span>
                      </Link>
                      {(session.user as any)?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-5 py-2 text-sm text-stone-600 hover:text-amber-700 hover:bg-stone-50 transition-colors"
                        >
                          <LayoutDashboard size={16} /> <span>Admin Panel</span>
                        </Link>
                      )}
                      <div className="border-t border-stone-100 mt-2 pt-2">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center gap-3 px-5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-5 py-2 text-sm text-stone-600 hover:text-amber-700 hover:bg-stone-50 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                         href="/register"
                         className="block px-5 py-2 text-sm text-stone-600 hover:text-amber-700 hover:bg-stone-50 transition-colors"
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
              className="text-stone-800 hover:text-amber-700 hover:bg-stone-50 transition-all p-2 rounded-full relative group"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-sm">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Enhanced Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2 border-t border-stone-100 pt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our collection..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-transparent focus:bg-white focus:border-stone-200 focus:ring-0 outline-none transition-all placeholder:text-stone-400"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2 text-sm font-medium transition-colors tracking-wide uppercase"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="px-4 py-2 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Close search"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </form>
        )}
      </nav>

      {/* Enhanced Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-100 bg-white animate-in fade-in slide-in-from-top-1">
          <div className="px-6 py-8 space-y-6 h-screen overflow-y-auto pb-32">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xl font-serif text-stone-900 border-b border-stone-100 pb-2"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xl font-serif text-stone-900 border-b border-stone-100 pb-2"
            >
              Shop All
            </Link>
            <div className="pt-2">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-4">Collections</p>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-stone-600 hover:text-amber-700 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
