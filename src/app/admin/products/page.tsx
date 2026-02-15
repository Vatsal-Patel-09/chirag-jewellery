import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Package } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  let allProducts: any[] = [];

  try {
    allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        stock: products.stock,
        images: products.images,
        isFeatured: products.isFeatured,
        isActive: products.isActive,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));
  } catch {
    // DB not connected
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products</h1>
          <p className="text-stone-500 text-sm mt-2">
            {allProducts.length} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-16 text-center">
          <Package size={48} className="mx-auto text-stone-300 mb-6" />
          <p className="text-stone-500">No products yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product: any) => {
                const img =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "/images/product/1.jpg";
                return (
                  <tr
                    key={product.id}
                    className="border-b border-stone-50 hover:bg-stone-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                          <Image
                            src={img}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-stone-900 truncate max-w-[200px]">
                            {product.name}
                          </p>
                          {product.isFeatured && (
                            <span className="text-xs text-amber-600 font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {product.categoryName || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {product.compareAtPrice ? (
                        <div>
                          <span className="font-medium text-red-600">
                            {formatPrice(parseFloat(product.price))}
                          </span>
                          <span className="text-stone-400 line-through text-xs ml-1">
                            {formatPrice(parseFloat(product.compareAtPrice))}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">
                          {formatPrice(parseFloat(product.price))}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          product.stock <= 5
                            ? "text-red-600"
                            : "text-stone-900"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-amber-600 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50 transition"
                        >
                          <Edit size={16} />
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
