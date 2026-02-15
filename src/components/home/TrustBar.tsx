import { Truck, ShieldCheck, RotateCcw, Lock } from "lucide-react";

const features = [
  { icon: Truck, title: "Complimentary Shipping", description: "On all orders above ₹5,000" },
  { icon: ShieldCheck, title: "Lifetime Authenticity", description: "Certified & hallmarked" },
  { icon: RotateCcw, title: "30-Day Returns", description: "No questions asked" },
  { icon: Lock, title: "Secure Transactions", description: "Encrypted & safe" },
];

export default function TrustBar() {
  return (
    <section className="bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
          {features.map((feature, idx) => (
            <div 
              key={feature.title} 
              className="flex flex-col items-center text-center p-10 hover:bg-stone-100 transition-colors duration-300"
            >
              <div className="mb-4 text-stone-900">
                <feature.icon size={28} strokeWidth={1} />
              </div>
              <h3 className="font-serif font-medium text-stone-900 text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-stone-500 text-sm font-light tracking-wide">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
