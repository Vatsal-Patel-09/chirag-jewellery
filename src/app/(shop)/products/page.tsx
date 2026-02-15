import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, gte, lte, ilike, or, desc, asc, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import ProductFilters from "@/components/product/ProductFilters";
import { Star, Heart, ChevronLeft, ChevronRight, Package, X } from "lucide-react";

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    material?: string;
    sort?: string;
    featured?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let allProducts: any[] = [];
  let allCategories: any[] = [];
  let totalCount = 0;

  try {
    // Fetch categories
    allCategories = await db.select().from(categories);

    // Build conditions
    const conditions: any[] = [eq(products.isActive, true)];

    if (params.category) {
      const cat = allCategories.find((c: any) => c.slug === params.category);
      if (cat) conditions.push(eq(products.categoryId, cat.id));
    }

    if (params.search) {
      conditions.push(
        or(
          ilike(products.name, `%${params.search}%`),
          ilike(products.description, `%${params.search}%`)
        )
      );
    }

    if (params.minPrice) {
      conditions.push(gte(products.price, params.minPrice));
    }

    if (params.maxPrice) {
      conditions.push(lte(products.price, params.maxPrice));
    }

    if (params.material) {
      conditions.push(eq(products.material, params.material));
    }

    if (params.featured === "true") {
      conditions.push(eq(products.isFeatured, true));
    }

    // Sort
    let orderBy: any = desc(products.createdAt);
    if (params.sort === "price_asc") orderBy = asc(products.price);
    else if (params.sort === "price_desc") orderBy = desc(products.price);
    else if (params.sort === "newest") orderBy = desc(products.createdAt);
    else if (params.sort === "name_asc") orderBy = asc(products.name);

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);
    totalCount = Number(countResult[0]?.count || 0);

    // Get products
    allProducts = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
  } catch {
    // Fallback when DB is not connected
    allCategories = [
      { id: "1", name: "Rings", slug: "rings" },
      { id: "2", name: "Necklaces", slug: "necklaces" },
      { id: "3", name: "Earrings", slug: "earrings" },
      { id: "4", name: "Bracelets", slug: "bracelets" },
      { id: "5", name: "Bangles", slug: "bangles" },
      { id: "6", name: "Pendants", slug: "pendants" },
      { id: "7", name: "Chains", slug: "chains" },
      { id: "8", name: "Anklets", slug: "anklets" },
    ];
    const fallbackProducts = [];
    for (let i = 1; i <= 12; i++) {
      fallbackProducts.push({
        id: String(i),
        name: `Jewellery Item ${i}`,
        slug: `jewellery-item-${i}`,
        price: String(5000 + i * 1000),
        compareAtPrice: i % 3 === 0 ? String(7000 + i * 1000) : null,
        images: [`/images/product/${i}.jpg`],
        isFeatured: i % 2 === 0,
        material: ["Gold", "Silver", "Diamond"][i % 3],
      });
    }
    allProducts = fallbackProducts;
    totalCount = 32;
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
        <Link href="/" className="hover:text-amber-600 transition">Home</Link>
        <span>/</span>
        <span className="text-stone-900">Shop</span>
        {params.category && (
          <>
            <span>/</span>
            <span className="text-stone-900 capitalize">{params.category}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters sidebar */}
        <ProductFilters
          categories={allCategories}
          currentCategory={params.category}
          currentSort={params.sort}
          currentMaterial={params.material}
          currentMinPrice={params.minPrice}
          currentMaxPrice={params.maxPrice}
          searchQuery={params.search}
        />

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-10">
            <div>
              {params.search && (
                <p className="text-stone-600 font-medium mb-1">
                  Results for <span className="text-amber-600">&quot;{params.search}&quot;</span>
                </p>
              )}
              <p className="text-stone-500 text-sm">
                Showing <span className="font-semibold text-stone-700">{allProducts.length}</span> of <span className="font-semibold text-stone-700">{totalCount}</span> products
              </p>
            </div>
          </div>

          {allProducts.length === 0 ? (
            <div className="text-center py-24 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
              <div className="inline-block p-6 bg-white rounded-full mb-6 shadow-lg">
                <Package size={48} className="text-stone-300" />
              </div>
              <p className="text-stone-600 text-xl mb-3 font-semibold">No products found</p>
              <p className="text-stone-500 mb-6">Try adjusting your filters or search terms</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <X size={18} />
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
              {allProducts.map((product: any) => {
                const imageUrl =
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : "/images/product/1.jpg";
                const price =
                  typeof product.price === "string"
                    ? parseFloat(product.price)
                    : product.price;
                const comparePrice = product.compareAtPrice
                  ? typeof product.compareAtPrice === "string"
                    ? parseFloat(product.compareAtPrice)
                    : product.compareAtPrice
                  : null;
                const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-4 shadow-md hover:shadow-2xl transition-all duration-500">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {comparePrice && (
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {discount}% OFF
                          </span>
                        </div>
                      )}
                      {product.isFeatured && (
                        <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Star size={12} className="fill-white" />
                          Featured
                        </span>
                      )}
                      <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110">
                        <Heart className="w-4 h-4 text-stone-600 hover:text-red-500 hover:fill-red-500 transition-colors" />
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="font-semibold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2 text-sm md:text-base leading-snug mb-1">
                      {product.name}
                    </h3>
                    {product.material && (
                      <p className="text-stone-400 text-xs mb-2 font-medium uppercase tracking-wide">{product.material}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-base md:text-lg">
                        {formatPrice(price)}
                      </span>
                      {comparePrice && (
                        <span className="text-stone-400 line-through text-xs md:text-sm">
                          {formatPrice(comparePrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={{
                    pathname: "/products",
                    query: { ...params, page: String(page - 1) },
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-stone-300 rounded-lg hover:bg-stone-50 hover:border-amber-600 transition-all text-sm font-medium"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Link>
              )}
              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Link
                      key={pageNum}
                      href={{
                        pathname: "/products",
                        query: { ...params, page: String(pageNum) },
                      }}
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                        pageNum === page
                          ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg scale-110"
                          : "border-2 border-stone-300 hover:bg-stone-50 hover:border-amber-600"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
              {page < totalPages && (
                <Link
                  href={{
                    pathname: "/products",
                    query: { ...params, page: String(page + 1) },
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-stone-300 rounded-lg hover:bg-stone-50 hover:border-amber-600 transition-all text-sm font-medium"
                >
                  Next
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
