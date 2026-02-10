"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface Props {
  product: {
    productId: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    slug: string;
  };
  disabled?: boolean;
}

export default function AddToCartButton({ product, disabled }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity,
    });
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity selector */}
      <div className="flex items-center border border-stone-300 rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 text-stone-600 hover:text-stone-900 transition"
          disabled={quantity <= 1}
        >
          <Minus size={18} />
        </button>
        <span className="px-4 py-3 font-medium text-stone-900 min-w-[3rem] text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="px-4 py-3 text-stone-600 hover:text-stone-900 transition"
          disabled={quantity >= product.stock}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || added}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-8 rounded-lg font-medium text-lg transition ${
          added
            ? "bg-green-600 text-white"
            : disabled
            ? "bg-stone-300 text-stone-500 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700 text-white"
        }`}
      >
        {added ? (
          <>
            <Check size={20} /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag size={20} /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
