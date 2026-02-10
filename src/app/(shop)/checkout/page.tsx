"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Loader2, ShoppingBag, MapPin, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    fullName: session?.user?.name || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const total = getTotal();
  const shipping = total >= 5000 ? 0 : 299;
  const orderTotal = total + shipping;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAddress = () => {
    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.phone) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (address.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateAddress()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: address,
          total: orderTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        return;
      }

      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}&orderNumber=${data.orderNumber}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-stone-300 mb-6" />
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-stone-500 mb-8">
          Add some items to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">
        Checkout
      </h1>

      {/* Step indicators */}
      <div className="flex items-center gap-4 mb-10">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-amber-600" : "text-stone-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-amber-600 text-white" : "bg-stone-200 text-stone-500"}`}>
            {step > 1 ? <Check size={16} /> : "1"}
          </div>
          <span className="font-medium text-sm hidden sm:block">Shipping</span>
        </div>
        <div className="flex-1 h-px bg-stone-200" />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-amber-600" : "text-stone-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-amber-600 text-white" : "bg-stone-200 text-stone-500"}`}>
            2
          </div>
          <span className="font-medium text-sm hidden sm:block">Review & Pay</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={24} className="text-amber-600" />
                <h2 className="text-xl font-semibold text-stone-900">
                  Shipping Address
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="House/Flat No., Street"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Address Line 2
                  </label>
                  <input
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Landmark, Area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    City *
                  </label>
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    State *
                  </label>
                  <input
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition"
              >
                Continue to Review
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Address review */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-stone-900">
                    Shipping Address
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-stone-600 text-sm leading-relaxed">
                  <p className="font-medium text-stone-900">{address.fullName}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                  <p className="mt-1">Phone: {address.phone}</p>
                </div>
              </div>

              {/* Items review */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Order Items ({items.length})
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 text-sm line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-stone-500 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-stone-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-lg font-medium text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-stone-50 rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">
                  Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
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
              <div className="border-t border-stone-200 pt-3 flex justify-between">
                <span className="font-semibold text-stone-900">Total</span>
                <span className="font-bold text-lg text-stone-900">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
