import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Banner 1 */}
          <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <Image
              src="/images/banner/bg-2.jpg"
              alt="New Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 md:p-12 max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider">New Collection</p>
                </div>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-5 leading-tight">
                  Bridal<br />Jewellery
                </h3>
                <p className="text-white/90 mb-6 text-sm md:text-base leading-relaxed">
                  Celebrate your special day with our exquisite bridal collection
                </p>
                <Link
                  href="/products?category=necklaces"
                  className="inline-flex items-center gap-2 bg-white text-stone-900 hover:bg-amber-600 hover:text-white px-6 md:px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <Image
              src="/images/banner/bg-3.jpg"
              alt="Special Offer"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 md:p-12 max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Exclusive</p>
                </div>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-5 leading-tight">
                  Diamond<br />Collection
                </h3>
                <p className="text-white/90 mb-6 text-sm md:text-base leading-relaxed">
                  Dazzle with our premium diamond pieces
                </p>
                <Link
                  href="/products?category=rings"
                  className="inline-flex items-center gap-2 bg-white text-stone-900 hover:bg-amber-600 hover:text-white px-6 md:px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                >
                  Explore
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
