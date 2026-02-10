"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface Props {
  categories: any[];
  currentCategory?: string;
  currentSort?: string;
  currentMaterial?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  searchQuery?: string;
}

const materials = ["Gold", "Silver", "Diamond", "Rose Gold", "Platinum"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
];

export default function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentMaterial,
  currentMinPrice,
  currentMaxPrice,
  searchQuery,
}: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams();
    if (currentCategory && key !== "category") params.set("category", currentCategory);
    if (currentSort && key !== "sort") params.set("sort", currentSort);
    if (currentMaterial && key !== "material") params.set("material", currentMaterial);
    if (currentMinPrice && key !== "minPrice") params.set("minPrice", currentMinPrice);
    if (currentMaxPrice && key !== "maxPrice") params.set("maxPrice", currentMaxPrice);
    if (searchQuery && key !== "search") params.set("search", searchQuery);

    if (value) {
      params.set(key, value);
    }

    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  const hasActiveFilters = currentCategory || currentMaterial || currentMinPrice || currentMaxPrice || searchQuery;

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-stone-900 mb-3">Sort By</h3>
        <select
          value={currentSort || "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-stone-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("category", undefined)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              !currentCategory
                ? "bg-amber-50 text-amber-700 font-medium"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.slug || cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                currentCategory === cat.slug
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="font-semibold text-stone-900 mb-3">Material</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("material", undefined)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              !currentMaterial
                ? "bg-amber-50 text-amber-700 font-medium"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            All Materials
          </button>
          {materials.map((mat) => (
            <button
              key={mat}
              onClick={() => updateFilter("material", mat)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                currentMaterial === mat
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-stone-900 mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentMinPrice}
            onBlur={(e) => updateFilter("minPrice", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentMaxPrice}
            onBlur={(e) => updateFilter("maxPrice", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition mb-4"
      >
        <SlidersHorizontal size={18} />
        Filters
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-28">{filterContent}</div>
      </div>
    </>
  );
}
