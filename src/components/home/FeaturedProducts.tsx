import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import { Star } from "lucide-react";

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
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 tracking-tight">
            Curated Excellence
          </h2>
          <p className="text-stone-600 text-lg font-light tracking-wide max-w-2xl mx-auto">
            Discover our most coveted pieces, chosen for their exceptional design and craftsmanship.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featuredProducts.map((product) => {
             const imageUrl = Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : "/images/product/1.jpg";
             const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
            
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white mb-6">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Subtle overlay on hover if desired */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick Add Button or similar could go here */}
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-stone-900 font-medium text-lg leading-snug group-hover:text-amber-800 transition-colors font-serif">
                    {product.name}
                  </h3>
                  <div className="text-stone-600 font-light tracking-wider">
                    {formatPrice(price)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-20">
          <Link
            href="/products"
            className="inline-block border-b border-stone-900 text-stone-900 pb-1 text-sm tracking-[0.2em] font-medium uppercase hover:text-amber-700 hover:border-amber-700 transition-colors"
          >
            View All Creations
          </Link>
        </div>
      </div>
    </section>
  );
}
