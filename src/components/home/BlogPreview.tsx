import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "How to Choose the Perfect Engagement Ring",
    excerpt: "A comprehensive guide to finding the ring that speaks to your love story.",
    image: "/images/blog/1.jpg",
    date: "Feb 5, 2026",
  },
  {
    id: 2,
    title: "Jewellery Care Tips: Keep Your Pieces Shining",
    excerpt: "Expert tips on maintaining the lustre of your precious jewellery.",
    image: "/images/blog/2.jpg",
    date: "Jan 28, 2026",
  },
  {
    id: 3,
    title: "Top Jewellery Trends for 2026",
    excerpt: "Discover the styles that are dominating the jewellery world this year.",
    image: "/images/blog/3.jpg",
    date: "Jan 15, 2026",
  },
  {
    id: 4,
    title: "The Art of Layering Necklaces",
    excerpt: "Master the art of necklace layering for a chic, effortless look.",
    image: "/images/blog/4.jpg",
    date: "Jan 8, 2026",
  },
];

export default function BlogPreview() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block px-4 py-2 bg-amber-50 rounded-full mb-4">
            <span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Our Journal</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
            From Our Journal
          </h2>
          <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Stories, tips, and inspiration from the world of jewellery
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {posts.map((post, idx) => (
            <article 
              key={post.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 text-amber-600 text-xs md:text-sm font-medium mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <h3 className="font-bold text-stone-900 mb-3 line-clamp-2 text-base md:text-lg leading-snug group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
