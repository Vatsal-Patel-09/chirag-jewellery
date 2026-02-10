import Image from "next/image";
import Link from "next/link";

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
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">
            From Our Journal
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Stories, tips, and inspiration from the world of jewellery
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-amber-600 text-sm font-medium mb-2">{post.date}</p>
                <h3 className="font-semibold text-stone-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition">
                  {post.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
