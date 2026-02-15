"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart, Check, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    images: string[];
    inStock?: boolean;
    stock?: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyNowLocal, setIsBuyNowLocal] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Convert price to number safely
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate slight network delay for better UX feel
    await new Promise(resolve => setTimeout(resolve, 400));
    
    addItem({
      productId: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.images[0] || "/placeholder.png",
      slug: product.slug,
      stock: product.stock !== undefined ? product.stock : (product.inStock ? 10 : 0),
    });

    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    setIsBuyNowLocal(true);
    
    addItem({
      productId: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.images[0] || "/placeholder.png",
      slug: product.slug,
      stock: product.stock !== undefined ? product.stock : (product.inStock ? 10 : 0),
    });
    
    router.push("/cart"); // Usually checkout, but let's go to cart first as is standard unless stripe is integrated
  };

  if (product.inStock === false) {
    return (
      <button 
        disabled
        className="w-full py-4 bg-stone-100 text-stone-400 font-medium rounded-xl border border-stone-200 cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isBuyNowLocal}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
          isAdded
            ? "bg-green-600 hover:bg-green-700 text-white border-transparent"
            : "bg-white text-stone-900 border border-stone-300 hover:border-amber-600 hover:text-amber-700 hover:shadow-md"
        }`}
      >
        {isAdding ? (
          <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
        ) : isAdded ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>

      <button
        onClick={handleBuyNow}
        disabled={isAdding || isBuyNowLocal}
        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-stone-900 hover:bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 border border-transparent"
      >
        {isBuyNowLocal ? (
          <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Buy Now
          </>
        )}
      </button>
    </div>
  );
}
