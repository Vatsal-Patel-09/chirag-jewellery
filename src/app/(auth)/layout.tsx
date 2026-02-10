import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/banner/bg-1.jpg"
          alt="Chirag Jewellery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-serif font-bold mb-4">Chirag Jewellery</h1>
            <p className="text-lg text-white/80">Timeless Elegance, Modern Design</p>
          </div>
        </div>
      </div>
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 lg:hidden">
            <Image
              src="/images/logo/logo-ash.png"
              alt="Chirag Jewellery"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
