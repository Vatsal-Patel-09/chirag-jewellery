"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface Category {
  id?: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  currentMaterial?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  searchQuery?: string;
}

const sortOptions = [
  { name: "Newest Arrivals", value: "newest" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
  { name: "Featured", value: "featured" },
];

export default function ProductFilters({
  categories,
  currentCategory: propCurrentCategory,
  currentSort: propCurrentSort,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Use props if available, otherwise fallback to searchParams
  const currentCategory = propCurrentCategory || searchParams.get("category") || "all";
  const currentSort = propCurrentSort || searchParams.get("sort") || "newest";

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    // Reset page on filter change
    params.delete("page");
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };


  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`);
    setSortOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block space-y-8">
          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-4 border-b border-stone-200 pb-2">Collections</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`text-sm w-full text-left py-1 hover:text-amber-800 transition-colors ${
                      currentCategory === cat.slug
                        ? "text-amber-700 font-semibold"
                        : "text-stone-600 font-light"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort Desktop */}
          <div>
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-4 border-b border-stone-200 pb-2">Sort By</h3>
             <ul className="space-y-2">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <button
                    onClick={() => handleSortChange(option.value)}
                    className={`text-sm w-full text-left py-1 hover:text-amber-800 transition-colors ${
                      currentSort === option.value
                        ? "text-amber-700 font-semibold"
                        : "text-stone-600 font-light"
                    }`}
                  >
                    {option.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Filter & Sort Triggers */}
        <div className="lg:hidden flex items-center justify-between gap-4 py-4 border-b border-stone-200">
           <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-stone-800 font-medium"
          >
            <SlidersHorizontal size={18} />
            <span>Filter</span>
          </button>
          
          <div className="relative">
             <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-stone-800 font-medium"
            >
              <span>Sort</span>
              <ChevronDown size={16} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-stone-100 z-50 py-2 rounded-lg">
                {sortOptions.map((option) => (
                   <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 ${currentSort === option.value ? 'text-amber-700 font-medium' : 'text-stone-600'}`}
                   >
                     {option.name}
                   </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-stone-900">Filter Products</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-medium text-stone-900 mb-4 uppercase tracking-wider text-xs">Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`px-4 py-3 rounded-sm border text-sm transition-all ${
                        currentCategory === cat.slug
                          ? "border-amber-700 bg-amber-50 text-amber-800 font-medium"
                          : "border-stone-200 text-stone-600 font-light"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
