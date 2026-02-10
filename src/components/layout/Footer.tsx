import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <Image
              src="/images/logo/logo-ash.png"
              alt="Chirag Jewellery"
              width={160}
              height={50}
              className="h-10 w-auto mb-4 brightness-200"
            />
            <p className="text-stone-400 text-sm leading-relaxed">
              Discover timeless elegance with Chirag Jewellery. We craft exquisite pieces
              that celebrate life&apos;s precious moments with the finest materials and
              unmatched craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  Featured Collection
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/account" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <span className="text-stone-400 text-sm">Shipping & Returns</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-stone-400 text-sm">
                  123, Jewellery Lane, Mumbai,<br />Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-400 flex-shrink-0" />
                <a href="mailto:info@chiragjewellery.com" className="text-stone-400 hover:text-amber-400 transition text-sm">
                  info@chiragjewellery.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-sm">
            © 2026 Chirag Jewellery. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-stone-500 text-xs">Trusted by 10,000+ customers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
