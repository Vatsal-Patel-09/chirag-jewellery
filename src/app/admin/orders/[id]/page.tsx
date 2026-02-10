import { db } from "@/lib/db";
import { orders, orderItems, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { UpdateOrderStatus } from "@/components/admin/UpdateOrderStatus";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  let order: any = null;
  let items: any[] = [];
  let customer: any = null;

  try {
    const [found] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!found) notFound();
    order = found;

    items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    if (order.userId) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, order.userId))
        .limit(1);
      customer = user;
    }
  } catch {
    notFound();
  }

  const addr = order.shippingAddress;

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            {order.orderNumber}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-3">Customer</h2>
          {customer ? (
            <div className="text-sm text-stone-600">
              <p className="font-medium text-stone-900">{customer.name}</p>
              <p>{customer.email}</p>
            </div>
          ) : (
            <p className="text-stone-500 text-sm">Unknown customer</p>
          )}
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-3">Shipping Address</h2>
          {addr ? (
            <div className="text-sm text-stone-600">
              <p className="font-medium text-stone-900">{addr.fullName}</p>
              <p>{addr.addressLine1}</p>
              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>{addr.city}, {addr.state} {addr.postalCode}</p>
              <p>Phone: {addr.phone}</p>
            </div>
          ) : (
            <p className="text-stone-500 text-sm">No address</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4">
          Items ({items.length})
        </h2>
        <div className="space-y-4">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 text-sm">
                  {item.productName}
                </p>
                <p className="text-stone-500 text-xs">
                  Qty: {item.quantity} × {formatPrice(parseFloat(item.price))}
                </p>
              </div>
              <p className="font-semibold text-stone-900 text-sm">
                {formatPrice(parseFloat(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-200 mt-4 pt-4 flex justify-between">
          <span className="font-semibold text-stone-900">Total</span>
          <span className="font-bold text-lg text-stone-900">
            {formatPrice(parseFloat(order.total))}
          </span>
        </div>
      </div>
    </div>
  );
}
