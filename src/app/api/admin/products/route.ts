import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }
  return session;
}

export async function POST(req: Request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, description, price, compareAtPrice, material, stock, categoryId, images, isFeatured, isActive } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 });
    }

    const slug = slugify(name);

    const [product] = await db
      .insert(products)
      .values({
        name,
        slug,
        description: description || null,
        price: String(price),
        compareAtPrice: compareAtPrice ? String(compareAtPrice) : null,
        material: material || null,
        stock: parseInt(stock) || 50,
        categoryId,
        images: images || [],
        isFeatured: isFeatured || false,
        isActive: isActive !== false,
      })
      .returning();

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
