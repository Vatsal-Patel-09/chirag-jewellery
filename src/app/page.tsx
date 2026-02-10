import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import BlogPreview from "@/components/home/BlogPreview";
import InstagramFeed from "@/components/home/InstagramFeed";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <CategoryShowcase />
        <FeaturedProducts />
        <PromoBanner />
        <BlogPreview />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
}
