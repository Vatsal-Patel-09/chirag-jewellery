import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import * as schema from "./schema";

// Load .env.local
config({ path: ".env.local" });

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await hash("admin123", 12);
  const [adminUser] = await db
    .insert(schema.users)
    .values({
      name: "Admin",
      email: "admin@chirag.com",
      password: hashedPassword,
      role: "admin",
    })
    .returning();
  console.log("✅ Admin user created");

  // Create categories
  const categoryData = [
    { name: "Rings", slug: "rings", description: "Exquisite rings for every occasion", imageUrl: "/images/product/1.jpg" },
    { name: "Necklaces", slug: "necklaces", description: "Elegant necklaces that make a statement", imageUrl: "/images/product/5.jpg" },
    { name: "Earrings", slug: "earrings", description: "Beautiful earrings to complement your style", imageUrl: "/images/product/10.jpg" },
    { name: "Bracelets", slug: "bracelets", description: "Stunning bracelets for a touch of elegance", imageUrl: "/images/product/15.jpg" },
    { name: "Bangles", slug: "bangles", description: "Traditional and modern bangles collection", imageUrl: "/images/product/20.jpg" },
    { name: "Pendants", slug: "pendants", description: "Charming pendants for everyday wear", imageUrl: "/images/product/25.jpg" },
    { name: "Chains", slug: "chains", description: "Fine chains crafted with precision", imageUrl: "/images/product/30.jpg" },
    { name: "Anklets", slug: "anklets", description: "Delicate anklets for a graceful look", imageUrl: "/images/product/35.jpg" },
  ];

  const insertedCategories = await db
    .insert(schema.categories)
    .values(categoryData)
    .returning();
  console.log("✅ Categories created");

  // Map for quick lookup
  const catMap: Record<string, string> = {};
  insertedCategories.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // Create products
  const materials = ["Gold", "Silver", "Rose Gold", "Platinum", "Diamond"];
  const productData = [
    // Rings (images 1-6)
    { name: "Classic Gold Solitaire Ring", slug: "classic-gold-solitaire-ring", description: "A timeless gold solitaire ring featuring a brilliant cut stone set in 18K gold. Perfect for engagements or special occasions.", price: "15999", categoryId: catMap["rings"], images: ["/images/product/1.jpg", "/images/product/2.jpg"], stock: 25, isFeatured: true, material: "Gold", weight: "4.5g" },
    { name: "Diamond Studded Band", slug: "diamond-studded-band", description: "An elegant band encrusted with premium diamonds, crafted in white gold for a luxurious modern look.", price: "28999", categoryId: catMap["rings"], images: ["/images/product/3.jpg", "/images/product/4.jpg"], stock: 15, isFeatured: true, material: "Diamond", weight: "3.8g" },
    { name: "Rose Gold Infinity Ring", slug: "rose-gold-infinity-ring", description: "A delicate infinity ring in rose gold with micro-pave diamonds symbolizing eternal love.", price: "12499", categoryId: catMap["rings"], images: ["/images/product/5.jpg", "/images/product/6.jpg"], stock: 30, isFeatured: false, material: "Rose Gold", weight: "3.2g" },
    { name: "Platinum Promise Ring", slug: "platinum-promise-ring", description: "A sleek platinum ring with a minimalist design, perfect as a promise ring or everyday wear.", price: "22999", categoryId: catMap["rings"], images: ["/images/product/7.jpg"], stock: 10, isFeatured: false, material: "Platinum", weight: "5.0g" },

    // Necklaces (images 7-12)
    { name: "Pearl Drop Necklace", slug: "pearl-drop-necklace", description: "An exquisite pearl drop necklace with a sterling silver chain, ideal for formal and festive occasions.", price: "8999", categoryId: catMap["necklaces"], images: ["/images/product/8.jpg", "/images/product/9.jpg"], stock: 20, isFeatured: true, material: "Silver", weight: "12g" },
    { name: "Gold Layered Chain Necklace", slug: "gold-layered-chain-necklace", description: "A trendy multi-layered gold chain necklace that adds sophistication to any outfit.", price: "18999", categoryId: catMap["necklaces"], images: ["/images/product/10.jpg", "/images/product/11.jpg"], stock: 18, isFeatured: true, material: "Gold", weight: "15g" },
    { name: "Diamond Pendant Necklace", slug: "diamond-pendant-necklace", description: "A stunning diamond pendant on a fine gold chain, perfect for an elegant evening look.", price: "35999", categoryId: catMap["necklaces"], images: ["/images/product/12.jpg", "/images/product/13.jpg"], stock: 8, isFeatured: false, material: "Diamond", weight: "8g" },
    { name: "Choker Style Statement Necklace", slug: "choker-style-statement-necklace", description: "A bold choker necklace with intricate goldwork, designed for those who love to make a statement.", price: "14999", categoryId: catMap["necklaces"], images: ["/images/product/14.jpg"], stock: 22, isFeatured: false, material: "Gold", weight: "20g" },

    // Earrings (images 13-18)
    { name: "Diamond Stud Earrings", slug: "diamond-stud-earrings", description: "Classic diamond stud earrings set in 18K white gold, a must-have in every jewellery collection.", price: "24999", categoryId: catMap["earrings"], images: ["/images/product/15.jpg", "/images/product/16.jpg"], stock: 35, isFeatured: true, material: "Diamond", weight: "2.5g" },
    { name: "Gold Jhumka Earrings", slug: "gold-jhumka-earrings", description: "Traditional gold jhumka earrings with intricate filigree work, perfect for festive and bridal wear.", price: "16999", categoryId: catMap["earrings"], images: ["/images/product/17.jpg", "/images/product/18.jpg"], stock: 28, isFeatured: true, material: "Gold", weight: "8g" },
    { name: "Silver Hoop Earrings", slug: "silver-hoop-earrings", description: "Modern sterling silver hoop earrings with a polished finish for everyday elegance.", price: "4999", categoryId: catMap["earrings"], images: ["/images/product/19.jpg", "/images/product/20.jpg"], stock: 50, isFeatured: false, material: "Silver", weight: "5g" },
    { name: "Rose Gold Drop Earrings", slug: "rose-gold-drop-earrings", description: "Elegant rose gold drop earrings with gemstone accents for a feminine and romantic look.", price: "11999", categoryId: catMap["earrings"], images: ["/images/product/21.jpg"], stock: 20, isFeatured: false, material: "Rose Gold", weight: "4g" },

    // Bracelets (images 19-24)
    { name: "Gold Chain Bracelet", slug: "gold-chain-bracelet", description: "A refined gold chain bracelet with a secure clasp, perfect for layering or wearing alone.", price: "13999", categoryId: catMap["bracelets"], images: ["/images/product/22.jpg", "/images/product/23.jpg"], stock: 25, isFeatured: true, material: "Gold", weight: "10g" },
    { name: "Diamond Tennis Bracelet", slug: "diamond-tennis-bracelet", description: "A luxurious diamond tennis bracelet featuring a continuous line of brilliant-cut diamonds.", price: "45999", categoryId: catMap["bracelets"], images: ["/images/product/24.jpg", "/images/product/25.jpg"], stock: 5, isFeatured: true, material: "Diamond", weight: "14g" },
    { name: "Silver Cuff Bracelet", slug: "silver-cuff-bracelet", description: "A bold sterling silver cuff bracelet with an adjustable fit and hammered texture.", price: "6999", categoryId: catMap["bracelets"], images: ["/images/product/26.jpg"], stock: 30, isFeatured: false, material: "Silver", weight: "18g" },
    { name: "Charm Bracelet Collection", slug: "charm-bracelet-collection", description: "A customizable charm bracelet in rose gold with various themed charms included.", price: "9499", categoryId: catMap["bracelets"], images: ["/images/product/27.jpg", "/images/product/28.jpg"], stock: 40, isFeatured: false, material: "Rose Gold", weight: "8g" },

    // Bangles (images 25-30)
    { name: "Traditional Gold Bangles Set", slug: "traditional-gold-bangles-set", description: "A set of four traditional gold bangles with intricate engravings, perfect for weddings and festivals.", price: "32999", categoryId: catMap["bangles"], images: ["/images/product/29.jpg", "/images/product/30.jpg"], stock: 12, isFeatured: true, material: "Gold", weight: "40g" },
    { name: "Diamond Accent Bangle", slug: "diamond-accent-bangle", description: "A sleek bangle with diamond accents along the edge for subtle sparkle.", price: "19999", categoryId: catMap["bangles"], images: ["/images/product/31.jpg", "/images/product/32.jpg"], stock: 15, isFeatured: false, material: "Diamond", weight: "15g" },
    { name: "Silver Kada Bangle", slug: "silver-kada-bangle", description: "A sturdy silver kada bangle with traditional motifs, a classic piece for men and women.", price: "7999", categoryId: catMap["bangles"], images: ["/images/product/33.jpg"], stock: 35, isFeatured: false, material: "Silver", weight: "25g" },
    { name: "Platinum Sleek Bangle", slug: "platinum-sleek-bangle", description: "A modern platinum bangle with a minimalist polished design for contemporary style.", price: "27999", categoryId: catMap["bangles"], images: ["/images/product/34.jpg"], stock: 8, isFeatured: false, material: "Platinum", weight: "18g" },

    // Pendants (images 31-36)
    { name: "Heart Shaped Gold Pendant", slug: "heart-shaped-gold-pendant", description: "A romantic heart-shaped pendant in 22K gold, a timeless gift for your loved one.", price: "11999", categoryId: catMap["pendants"], images: ["/images/product/35.jpg", "/images/product/36.jpg"], stock: 30, isFeatured: true, material: "Gold", weight: "3g" },
    { name: "Diamond Solitaire Pendant", slug: "diamond-solitaire-pendant", description: "A stunning solitaire diamond pendant that catches light from every angle.", price: "29999", categoryId: catMap["pendants"], images: ["/images/product/37.jpg", "/images/product/38.jpg"], stock: 10, isFeatured: true, material: "Diamond", weight: "2.8g" },
    { name: "Silver Om Pendant", slug: "silver-om-pendant", description: "A spiritual silver Om pendant with fine detailing, perfect for daily wear.", price: "3499", categoryId: catMap["pendants"], images: ["/images/product/39.jpg"], stock: 45, isFeatured: false, material: "Silver", weight: "4g" },
    { name: "Rose Gold Floral Pendant", slug: "rose-gold-floral-pendant", description: "A delicate floral pendant in rose gold with tiny diamond accents in the petals.", price: "14999", categoryId: catMap["pendants"], images: ["/images/product/40.jpg"], stock: 22, isFeatured: false, material: "Rose Gold", weight: "3.5g" },

    // Chains (images 37-42)
    { name: "22K Gold Rope Chain", slug: "22k-gold-rope-chain", description: "A classic 22K gold rope chain with a sturdy clasp, available in multiple lengths.", price: "24999", categoryId: catMap["chains"], images: ["/images/product/41.jpg", "/images/product/42.jpg"], stock: 20, isFeatured: true, material: "Gold", weight: "12g" },
    { name: "Silver Box Chain", slug: "silver-box-chain", description: "A sleek sterling silver box chain with a modern geometric design.", price: "3999", categoryId: catMap["chains"], images: ["/images/product/43.jpg", "/images/product/44.jpg"], stock: 40, isFeatured: false, material: "Silver", weight: "8g" },
    { name: "Platinum Curb Chain", slug: "platinum-curb-chain", description: "A premium platinum curb chain with a heavy, luxurious feel.", price: "38999", categoryId: catMap["chains"], images: ["/images/product/45.jpg"], stock: 6, isFeatured: false, material: "Platinum", weight: "20g" },
    { name: "Rose Gold Figaro Chain", slug: "rose-gold-figaro-chain", description: "An elegant rose gold figaro chain with alternating link patterns.", price: "15999", categoryId: catMap["chains"], images: ["/images/product/46.jpg"], stock: 18, isFeatured: false, material: "Rose Gold", weight: "10g" },

    // Anklets (images 43-48)
    { name: "Silver Payal Anklet Set", slug: "silver-payal-anklet-set", description: "A traditional silver payal anklet set with tinkling bells, a symbol of Indian elegance.", price: "5999", categoryId: catMap["anklets"], images: ["/images/product/47.jpg", "/images/product/48.jpg"], stock: 35, isFeatured: true, material: "Silver", weight: "15g" },
    { name: "Gold Charm Anklet", slug: "gold-charm-anklet", description: "A delicate gold anklet with small charms, perfect for beach wear and summer style.", price: "9999", categoryId: catMap["anklets"], images: ["/images/product/49.jpg", "/images/product/50.jpg"], stock: 25, isFeatured: false, material: "Gold", weight: "6g" },
    { name: "Diamond Studded Anklet", slug: "diamond-studded-anklet", description: "A luxurious anklet with diamond studs set in white gold for a glamorous look.", price: "18999", categoryId: catMap["anklets"], images: ["/images/product/70.jpg", "/images/product/71.jpg"], stock: 10, isFeatured: false, material: "Diamond", weight: "8g" },
    { name: "Rose Gold Minimalist Anklet", slug: "rose-gold-minimalist-anklet", description: "A simple yet elegant rose gold anklet with a single gem accent.", price: "7499", categoryId: catMap["anklets"], images: ["/images/product/72.jpg"], stock: 30, isFeatured: false, material: "Rose Gold", weight: "4g" },
  ];

  await db.insert(schema.products).values(productData);
  console.log("✅ Products created");

  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
