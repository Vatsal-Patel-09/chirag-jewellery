"use client";

import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Sparkles, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const shipping = total >= 5000 ? 0 : 299;
  const orderTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-block p-8 bg-gradient-to-br from-amber-50 to-stone-50 rounded-full mb-6 shadow-lg">
            <ShoppingBag size={64} className="text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-stone-600 mb-8 text-lg">
            Looks like you haven&apos;t added any items yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-10 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingBag size={20} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3 flex items-center gap-3">
          <ShoppingBag className="text-amber-600" />
          Shopping Cart
        </h1>
        <p className="text-stone-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-5 md:gap-7 p-6 md:p-7 bg-white border-2 border-stone-100 rounded-2xl hover:border-amber-200 hover:shadow-lg transition-all duration-300"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 group"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2 mb-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-stone-900 hover:text-amber-600 transition line-clamp-2 leading-snug"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0 p-2 rounded-lg"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-amber-600 font-bold text-lg mb-4">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border-2 border-stone-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-4 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-5 py-2.5 text-sm font-bold min-w-[3rem] text-center bg-stone-50">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-4 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500 mb-1">Subtotal</p>
                    <p className="font-bold text-stone-900 text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-6 border-t-2 border-stone-100">
            <Link
              href="/products"
              className="flex items-center gap-2 text-stone-600 hover:text-amber-600 transition font-medium group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Enhanced Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-stone-50 to-amber-50/30 rounded-2xl p-6 md:p-8 sticky top-28 border-2 border-stone-100 shadow-lg">
            <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Package className="text-amber-600" />
              Order Summary
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600 font-medium">Shipping</span>
                <span className="font-bold">
                  {shipping === 0 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Sparkles size={14} />
                      Free
                    </span>
                  ) : (
                    <span className="text-stone-900">{formatPrice(shipping)}</span>
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
                    <Sparkles size={14} />
                    Add {formatPrice(5000 - total)} more for free shipping!
                  </p>
                  <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                      style={{ width: `${Math.min((total / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="border-t-2 border-stone-200 pt-4 flex justify-between items-center">
                <span className="font-bold text-stone-900 text-base">Total</span>
                <span className="font-bold text-2xl text-amber-600">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-4 rounded-xl font-bold text-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
            >
              Proceed to Checkout
            </Link>
            <p className="mt-4 text-xs text-center text-stone-500">
              Secure checkout powered by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
