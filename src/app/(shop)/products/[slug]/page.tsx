import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import ProductGalleryClient from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/product/AddToCartButton";
import type { Metadata } from "next";
import { ChevronRight, Star, Truck, ShieldCheck, RefreshCw, Lock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (!product) return { title: "Product Not Found" };
    return {
      title: product.name,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product: any = null;
  let category: any = null;
  let relatedProducts: any[] = [];

  try {
    const [foundProduct] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!foundProduct) notFound();
    product = foundProduct;

    if (product.categoryId) {
      const [cat] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, product.categoryId))
        .limit(1);
      category = cat;

      relatedProducts = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, product.categoryId))
        .limit(4);
      relatedProducts = relatedProducts.filter((p: any) => p.id !== product.id);
    }
  } catch {
    // Fallback for when DB not connected
    product = {
      id: "fallback",
      name: "Sample Jewellery Product",
      slug: slug,
      description:
        "This is a beautiful handcrafted jewellery piece made with the finest materials. Perfect for everyday wear or special occasions. Our artisans ensure each piece meets the highest quality standards.",
      price: "15999",
      compareAtPrice: "19999",
      images: [
        `/images/product/1.jpg`,
        `/images/product/2.jpg`,
        `/images/product/3.jpg`,
      ],
      stock: 25,
      material: "Gold",
      weight: "4.5g",
      isFeatured: true,
      categoryId: "1",
    };
    category = { name: "Rings", slug: "rings" };
    relatedProducts = [
      {
        id: "2",
        name: "Diamond Ring",
        slug: "diamond-ring",
        price: "28999",
        images: ["/images/product/3.jpg"],
      },
      {
        id: "3",
        name: "Silver Ring",
        slug: "silver-ring",
        price: "8999",
        images: ["/images/product/5.jpg"],
      },
      {
        id: "4",
        name: "Gold Band",
        slug: "gold-band",
        price: "12999",
        images: ["/images/product/7.jpg"],
      },
    ];
  }

  const productImages: string[] = Array.isArray(product.images)
    ? product.images
    : ["/images/product/1.jpg"];
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;
  const comparePrice = product.compareAtPrice
    ? typeof product.compareAtPrice === "string"
      ? parseFloat(product.compareAtPrice)
      : product.compareAtPrice
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
      {/* Breadcrumbs */}
      {/* Breadcrumbs Section */}
      <div className="bg-stone-50 border-b border-stone-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-stone-500 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide">
            <Link href="/" className="hover:text-amber-600 transition shrink-0">
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0 text-stone-300" />
            <Link href="/products" className="hover:text-amber-600 transition shrink-0">
              Shop
            </Link>
            {category && (
              <>
                <ChevronRight size={14} className="shrink-0 text-stone-300" />
                <Link
                  href={`/products?category=${category.slug}`}
                  className="hover:text-amber-600 transition shrink-0 capitalize"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="shrink-0 text-stone-300" />
            <span className="text-stone-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Gallery */}
          <ProductGalleryClient images={productImages} productName={product.name} />

          {/* Product Info */}
          <div className="flex flex-col h-full">
            <div className="mb-8">
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  Bestseller
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-stone-900">
                    {formatPrice(price)}
                  </span>
                  {comparePrice && (
                    <span className="text-xl text-stone-400 line-through decoration-stone-300">
                      {formatPrice(comparePrice)}
                    </span>
                  )}
                </div>
                {comparePrice && (
                  <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-md border border-rose-100 uppercase tracking-wide">
                    {Math.round(((comparePrice - price) / comparePrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed mb-8 border-b border-stone-100 pb-8">
                <p>{product.description}</p>
              </div>

              {/* Product Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.material && (
                  <div className="flex flex-col p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Material</span>
                    <span className="font-medium text-stone-900">{product.material}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex flex-col p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Weight</span>
                    <span className="font-medium text-stone-900">{product.weight}</span>
                  </div>
                )}
                <div className="flex flex-col p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Availability</span>
                  <span
                    className={`font-medium ${
                      product.stock > 0 ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {product.stock > 0
                      ? "In Stock & Ready to Ship"
                      : "Currently Unavailable"}
                  </span>
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="mb-10">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: price,
                    images: productImages,
                    slug: product.slug,
                    stock: product.stock,
                    inStock: product.stock > 0
                  }}
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-8 border-t border-stone-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-50 rounded-full text-stone-600 shrink-0">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Free Shipping</p>
                    <p className="text-xs text-stone-500 leading-snug">On all orders over ₹5,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-50 rounded-full text-stone-600 shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Certified Authentic</p>
                    <p className="text-xs text-stone-500 leading-snug">100% Hallmarked Jewelry</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-50 rounded-full text-stone-600 shrink-0">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Easy Returns</p>
                    <p className="text-xs text-stone-500 leading-snug">7-day hassle-free return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-50 rounded-full text-stone-600 shrink-0">
                    <Lock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Secure Payment</p>
                    <p className="text-xs text-stone-500 leading-snug">Encrypted & safe checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-stone-200">
            <div className="flex flex-col items-center mb-12">
              <span className="text-amber-600 font-medium tracking-wider text-sm uppercase mb-3">Discover More</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center">
                You May Also Like
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((rp: any) => {
                const rpImg =
                  Array.isArray(rp.images) && rp.images.length > 0
                    ? rp.images[0]
                    : "/images/product/1.jpg";
                const rpPrice =
                  typeof rp.price === "string"
                    ? parseFloat(rp.price)
                    : rp.price;
                return (
                  <Link
                    key={rp.id}
                    href={`/products/${rp.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-4 shadow-sm group-hover:shadow-lg transition-all duration-500">
                      <Image
                        src={rpImg}
                        alt={rp.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="font-serif font-medium text-stone-900 group-hover:text-amber-700 transition line-clamp-1 text-lg mb-1">
                      {rp.name}
                    </h3>
                    <p className="font-bold text-stone-700">
                      {formatPrice(rpPrice)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

