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
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <Instagram className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
            Follow Us on Instagram
          </h2>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-lg transition-colors"
          >
            <span>@chiragjewellery</span>
            <Instagram className="w-5 h-5" />
          </a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {images.map((img, index) => (
            <a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={img}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-xl">
                  <Instagram size={20} className="text-amber-600" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
