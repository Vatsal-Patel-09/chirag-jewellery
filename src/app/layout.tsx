import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/session-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Chirag Jewellery — Timeless Elegance, Modern Design",
    template: "%s | Chirag Jewellery",
  },
  description:
    "Discover exquisite handcrafted jewellery at Chirag Jewellery. Shop rings, necklaces, earrings, bracelets and more in gold, silver, diamond and platinum.",
  keywords: [
    "jewellery",
    "gold jewellery",
    "diamond rings",
    "necklaces",
    "earrings",
    "bracelets",
    "online jewellery store",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
