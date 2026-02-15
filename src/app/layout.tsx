import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/session-provider";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ashirwaad Jewellery — Timeless Elegance, Modern Design",
    template: "%s | Ashirwaad Jewellery",
  },
  description:
    "Discover exquisite handcrafted jewellery at Ashirwaad Jewellery. Shop rings, necklaces, earrings, bracelets and more in gold, silver, diamond and platinum.",
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
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="antialiased font-sans text-stone-800 bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
