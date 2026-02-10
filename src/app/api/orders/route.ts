import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products, cartItems } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { generateOrderId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    const orderNumber = generateOrderId();

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: session.user.id,
        status: "confirmed",
        total: String(total),
        shippingAddress,
      })
      .returning();

    // Create order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        productName: item.name,
        productImage: item.image,
        price: String(item.price),
        quantity: item.quantity,
      });

      // Decrement stock
      await db
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

    // Clear user's cart items in DB
    await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(sql`${orders.createdAt} DESC`);

    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
