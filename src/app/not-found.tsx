import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-serif font-bold text-amber-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-stone-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
