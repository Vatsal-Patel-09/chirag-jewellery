import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, ChevronRight } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  let userOrders: any[] = [];

  try {
    const session = await auth();
    if (session?.user?.id) {
      userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, session.user.id))
        .orderBy(desc(orders.createdAt));
    }
  } catch {
    // DB not connected
  }

  if (userOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-24 text-center">
        <Package size={64} className="mx-auto text-stone-300 mb-8" />
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-4">
          No Orders Yet
        </h1>
        <p className="text-stone-500 mb-10">
          Start shopping to see your orders here.
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
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-10">
        My Orders
      </h1>
      <div className="space-y-5">
        {userOrders.map((order: any) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white border border-stone-200 rounded-xl p-7 hover:border-amber-300 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-semibold text-stone-900">
                    {order.orderNumber}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      statusColors[order.status] || "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-stone-500 text-sm">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-stone-900">
                  {formatPrice(parseFloat(order.total))}
                </p>
                <ChevronRight size={20} className="text-stone-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
