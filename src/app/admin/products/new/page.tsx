"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    material: "",
    stock: "50",
    categoryId: "",
    isFeatured: false,
    isActive: true,
  });
  const [images, setImages] = useState<string[]>(["/images/product/1.jpg"]);
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const type = (e.target as HTMLInputElement).type;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages((prev) => [...prev, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Name, price, and category are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });

      if (res.ok) {
        toast.success("Product created!");
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create product");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-stone-900 mb-8">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-semibold text-stone-900 mb-2">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Gold Diamond Necklace"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
              placeholder="Describe the product..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Category *
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Material
            </label>
            <input
              name="material"
              value={form.material}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Gold, Silver, Diamond..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-semibold text-stone-900 mb-2">Pricing & Stock</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Price (₹) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Sale Price (₹)
              </label>
              <input
                name="compareAtPrice"
                type="number"
                value={form.compareAtPrice}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="12000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-semibold text-stone-900 mb-2">Images</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg text-sm"
              >
                <span className="truncate max-w-[200px]">{img}</span>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="text-stone-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="/images/product/1.jpg"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 rounded-lg transition"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
          <h2 className="font-semibold text-stone-900 mb-2">Options</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="accent-amber-600"
            />
            <span className="text-sm text-stone-700">Featured Product</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="accent-amber-600"
            />
            <span className="text-sm text-stone-700">Active (visible on store)</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
