"use client";

import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const shipping = total >= 5000 ? 0 : 299;
  const orderTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-stone-300 mb-6" />
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-stone-500 mb-8">
          Looks like you haven&apos;t added any items yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition"
        >
          <ShoppingBag size={20} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-stone-900 hover:text-amber-600 transition line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-stone-400 hover:text-red-500 transition flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-amber-600 font-bold mt-1">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-stone-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-3 py-1.5 text-stone-600 hover:text-stone-900 transition"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-1.5 text-stone-600 hover:text-stone-900 transition"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-stone-900 text-sm md:text-base">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <Link
              href="/products"
              className="flex items-center gap-2 text-stone-500 hover:text-amber-600 transition text-sm"
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-stone-50 rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-amber-600">
                  Add {formatPrice(5000 - total)} more for free shipping
                </p>
              )}
              <div className="border-t border-stone-200 pt-3 flex justify-between">
                <span className="font-semibold text-stone-900">Total</span>
                <span className="font-bold text-lg text-stone-900">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium text-center transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
