import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { UpdateOrderStatus } from "@/components/admin/UpdateOrderStatus";

export default async function AdminOrdersPage() {
  let allOrders: any[] = [];

  try {
    allOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));
  } catch {
    // DB not connected
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
        <p className="text-stone-500 text-sm mt-2">
          {allOrders.length} orders
        </p>
      </div>

      {allOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-16 text-center">
          <ShoppingCart size={48} className="mx-auto text-stone-300 mb-6" />
          <p className="text-stone-500">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100">
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b border-stone-50 hover:bg-stone-50 transition"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-amber-600 hover:text-amber-700"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-900">
                      {order.userName || "Unknown"}
                    </p>
                    <p className="text-stone-400 text-xs">
                      {order.userEmail}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatPrice(parseFloat(order.total))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        statusColors[order.status] ||
                        "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <UpdateOrderStatus
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
