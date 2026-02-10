import Image from "next/image";
import { Instagram } from "lucide-react";

const images = [
  "/images/instagram/insta-1.jpg",
  "/images/instagram/insta-2.jpg",
  "/images/instagram/insta-3.jpg",
  "/images/instagram/insta-4.jpg",
  "/images/instagram/insta-5.jpg",
  "/images/instagram/insta-6.jpg",
];

export default function InstagramFeed() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">
            Follow Us on Instagram
          </h2>
          <p className="text-stone-500">@chiragjewellery</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {images.map((img, index) => (
            <a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <Image
                src={img}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <Instagram
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
