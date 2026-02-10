import { db } from "@/lib/db";
import { users, products, orders, orderItems, categories } from "@/lib/db/schema";
import { sql, eq, desc } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Users as UsersIcon, Package, ShoppingCart, IndianRupee, ChevronRight, TrendingUp } from "lucide-react";

async function getStats() {
  try {
    const [userCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    const [productCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);

    const [orderCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders);

    const [revenue] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${orders.total}::numeric), 0)`,
      })
      .from(orders)
      .where(sql`${orders.status} != 'cancelled'`);

    const recentOrders = await db
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
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return {
      userCount: userCount?.count || 0,
      productCount: productCount?.count || 0,
      orderCount: orderCount?.count || 0,
      revenue: parseFloat(revenue?.total || "0"),
      recentOrders,
    };
  } catch {
    return {
      userCount: 0,
      productCount: 0,
      orderCount: 0,
      revenue: 0,
      recentOrders: [],
    };
  }
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.revenue),
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Orders",
      value: stats.orderCount.toString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Products",
      value: stats.productCount.toString(),
      icon: Package,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Customers",
      value: stats.userCount.toString(),
      icon: UsersIcon,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">
            Overview of your store
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-stone-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  <Icon size={20} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
              <p className="text-stone-500 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="p-6 text-stone-500 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-100">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
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
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                          statusColors[order.status] || "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(parseFloat(order.total))}
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
