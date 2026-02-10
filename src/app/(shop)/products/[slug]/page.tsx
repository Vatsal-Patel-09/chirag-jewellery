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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
        <Link href="/" className="hover:text-amber-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-600 transition">
          Shop
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-amber-600 transition"
            >
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Gallery */}
        <ProductGalleryClient images={productImages} name={product.name} />

        {/* Product Info */}
        <div>
          {product.isFeatured && (
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
              Bestseller
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-stone-900">
              {formatPrice(price)}
            </span>
            {comparePrice && (
              <>
                <span className="text-xl text-stone-400 line-through">
                  {formatPrice(comparePrice)}
                </span>
                <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-0.5 rounded">
                  {Math.round(((comparePrice - price) / comparePrice) * 100)}%
                  OFF
                </span>
              </>
            )}
          </div>

          <p className="text-stone-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {product.material && (
              <div className="bg-stone-50 p-4 rounded-lg">
                <p className="text-sm text-stone-500">Material</p>
                <p className="font-medium text-stone-900">{product.material}</p>
              </div>
            )}
            {product.weight && (
              <div className="bg-stone-50 p-4 rounded-lg">
                <p className="text-sm text-stone-500">Weight</p>
                <p className="font-medium text-stone-900">{product.weight}</p>
              </div>
            )}
            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-500">Availability</p>
              <p
                className={`font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} left)`
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Add to cart */}
          <AddToCartButton
            product={{
              productId: product.id,
              name: product.name,
              price: price,
              image: productImages[0],
              stock: product.stock,
              slug: product.slug,
            }}
            disabled={product.stock <= 0}
          />

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Free Shipping above ₹5,000
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Certified &amp; Hallmarked
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              30-Day Returns
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                  className="group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                    <Image
                      src={rpImg}
                      alt={rp.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-stone-900 group-hover:text-amber-600 transition line-clamp-1 text-sm">
                    {rp.name}
                  </h3>
                  <p className="font-bold text-stone-900 text-sm mt-1">
                    {formatPrice(rpPrice)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
