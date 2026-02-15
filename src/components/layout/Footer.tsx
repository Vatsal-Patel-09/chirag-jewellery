import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* About */}
          <div>
            <Image
              src="/images/logo/logo-ash.png"
              alt="Chirag Jewellery"
              width={180}
              height={55}
              className="h-10 w-auto mb-8 brightness-0 invert opacity-90"
            />
            <p className="text-stone-400 text-sm leading-relaxed mb-6 font-light">
              Crafting timeless elegance for life's most precious moments. Every piece tells a story of unmatched craftsmanship and heritage.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-amber-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-amber-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-amber-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6 tracking-wide">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-stone-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-stone-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="text-stone-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                  Featured Collection
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="text-stone-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-600 rounded-full"></div>
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/account" className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-amber-600 group-hover:w-4 transition-all"></span>
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-amber-600 group-hover:w-4 transition-all"></span>
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-amber-600 group-hover:w-4 transition-all"></span>
                  Shopping Cart
                </Link>
              </li>
              <li>
                <span className="text-stone-400 text-sm flex items-center gap-2">
                  <span className="w-0 h-0.5"></span>
                  Shipping & Returns
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-600 rounded-full"></div>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-amber-600/10 p-2 rounded-lg mt-0.5">
                  <MapPin size={16} className="text-amber-400 flex-shrink-0" />
                </div>
                <span className="text-stone-400 text-sm leading-relaxed">
                  123, Jewellery Lane, Mumbai,<br />Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-amber-600/10 p-2 rounded-lg">
                  <Phone size={16} className="text-amber-400 flex-shrink-0" />
                </div>
                <a href="tel:+919876543210" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-amber-600/10 p-2 rounded-lg">
                  <Mail size={16} className="text-amber-400 flex-shrink-0" />
                </div>
                <a href="mailto:info@chiragjewellery.com" className="text-stone-400 hover:text-amber-400 transition-colors text-sm break-all">
                  info@chiragjewellery.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-stone-500 text-sm flex items-center gap-2">
            © 2026 Chirag Jewellery. All rights reserved.
            <span className="hidden sm:inline">•</span>
            Made with <Heart size={14} className="text-red-500 inline fill-red-500" /> in India
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-stone-500 hover:text-amber-400 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-stone-500 hover:text-amber-400 text-xs transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
