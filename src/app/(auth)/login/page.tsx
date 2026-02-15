"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full mb-5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-amber-700 font-semibold text-sm">Welcome Back</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">
          Sign In to Your Account
        </h2>
        <p className="text-stone-600 text-lg">
          Continue your jewellery shopping journey
        </p>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-6 py-5 rounded-xl mb-8 animate-fade-in">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white text-base shadow-sm hover:border-amber-200"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white pr-12 text-base shadow-sm hover:border-amber-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
        >
          {loading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t-2 border-stone-100">
        <p className="text-center text-stone-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-600 hover:text-amber-700 font-bold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
