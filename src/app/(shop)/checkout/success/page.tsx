"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-600" />
      </div>
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-3">
        Order Placed Successfully!
      </h1>
      <p className="text-stone-500 text-lg mb-2">
        Thank you for your purchase.
      </p>
      {orderNumber && (
        <p className="text-stone-700 font-medium mb-8">
          Order Number: <span className="text-amber-600 font-bold">{orderNumber}</span>
        </p>
      )}
      <p className="text-stone-500 mb-10 max-w-md mx-auto">
        We&apos;ve received your order and will begin processing it shortly.
        You can track your order status from your orders page.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            <Package size={20} /> View Order
          </Link>
        )}
        <Link
          href="/products"
          className="flex items-center gap-2 border-2 border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-600 px-8 py-3 rounded-lg font-medium transition"
        >
          <ShoppingBag size={20} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
