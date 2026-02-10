import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import BlogPreview from "@/components/home/BlogPreview";
import InstagramFeed from "@/components/home/InstagramFeed";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryShowcase />
      <FeaturedProducts />
      <PromoBanner />
      <BlogPreview />
      <InstagramFeed />
    </>
  );
}
