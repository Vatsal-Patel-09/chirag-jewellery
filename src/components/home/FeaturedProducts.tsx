import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";

export default async function FeaturedProducts() {
  let featuredProducts: any[] = [];
  
  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .limit(8);
  } catch {
    // DB not connected yet, use placeholder data
    featuredProducts = [
      { id: "1", name: "Classic Gold Solitaire Ring", slug: "classic-gold-solitaire-ring", price: "15999", compareAtPrice: null, images: ["/images/product/1.jpg"], isFeatured: true },
      { id: "2", name: "Diamond Studded Band", slug: "diamond-studded-band", price: "28999", compareAtPrice: "34999", images: ["/images/product/3.jpg"], isFeatured: true },
      { id: "3", name: "Pearl Drop Necklace", slug: "pearl-drop-necklace", price: "8999", compareAtPrice: null, images: ["/images/product/8.jpg"], isFeatured: true },
      { id: "4", name: "Gold Layered Chain Necklace", slug: "gold-layered-chain-necklace", price: "18999", compareAtPrice: null, images: ["/images/product/10.jpg"], isFeatured: true },
      { id: "5", name: "Diamond Stud Earrings", slug: "diamond-stud-earrings", price: "24999", compareAtPrice: "29999", images: ["/images/product/15.jpg"], isFeatured: true },
      { id: "6", name: "Gold Jhumka Earrings", slug: "gold-jhumka-earrings", price: "16999", compareAtPrice: null, images: ["/images/product/17.jpg"], isFeatured: true },
      { id: "7", name: "Gold Chain Bracelet", slug: "gold-chain-bracelet", price: "13999", compareAtPrice: null, images: ["/images/product/22.jpg"], isFeatured: true },
      { id: "8", name: "Diamond Tennis Bracelet", slug: "diamond-tennis-bracelet", price: "45999", compareAtPrice: "52999", images: ["/images/product/24.jpg"], isFeatured: true },
    ];
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">
            Our Bestsellers
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Handpicked favourites loved by our customers
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => {
            const imageUrl = Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : "/images/product/1.jpg";
            const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
            const comparePrice = product.compareAtPrice
              ? typeof product.compareAtPrice === "string"
                ? parseFloat(product.compareAtPrice)
                : product.compareAtPrice
              : null;
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {comparePrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Sale
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-stone-900 group-hover:text-amber-600 transition line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-stone-900">
                    {formatPrice(price)}
                  </span>
                  {comparePrice && (
                    <span className="text-stone-400 line-through text-sm">
                      {formatPrice(comparePrice)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-lg font-medium transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
