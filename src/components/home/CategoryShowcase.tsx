import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "Rings", slug: "rings", image: "/images/product/1.jpg" },
  { name: "Necklaces", slug: "necklaces", image: "/images/product/10.jpg" },
  { name: "Earrings", slug: "earrings", image: "/images/product/15.jpg" },
  { name: "Bracelets", slug: "bracelets", image: "/images/product/22.jpg" },
  { name: "Bangles", slug: "bangles", image: "/images/product/29.jpg" },
  { name: "Pendants", slug: "pendants", image: "/images/product/35.jpg" },
  { name: "Chains", slug: "chains", image: "/images/product/41.jpg" },
  { name: "Anklets", slug: "anklets", image: "/images/product/47.jpg" },
];

export default function CategoryShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 tracking-tight">
            Our Collections
          </h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto opacity-20"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-stone-100"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-serif text-2xl mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                <span className="text-white/80 text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                  View <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
