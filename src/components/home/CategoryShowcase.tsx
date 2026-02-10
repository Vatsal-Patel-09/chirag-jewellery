import Image from "next/image";
import Link from "next/link";

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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Explore our wide range of jewellery categories crafted with precision and love
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-4 md:p-6">
                <div>
                  <h3 className="text-white font-semibold text-lg md:text-xl">{cat.name}</h3>
                  <span className="text-amber-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
