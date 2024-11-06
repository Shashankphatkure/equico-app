"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const justRegistered = searchParams.get("registered") === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-[500px] h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E2FF3F] to-[#d4f129] opacity-20 blur-3xl animate-blob"></div>
        </div>
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E2FF3F] to-[#d4f129] opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
          </Link>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#E2FF3F] hover:text-[#d4f129]"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/80 backdrop-blur-lg py-8 px-4 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
            {justRegistered && (
              <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                Registration successful! Please log in.
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#E2FF3F] focus:ring-[#E2FF3F] py-3 px-4 text-base"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#E2FF3F] focus:ring-[#E2FF3F] py-3 px-4 text-base"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#E2FF3F] focus:ring-[#E2FF3F]"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#E2FF3F] hover:text-[#d4f129]"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2FF3F] transition-all duration-300"
              >
                Sign in
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 transition-all duration-300">
                  <img src="/google.svg" alt="Google" className="h-5 w-5" />
                  Google
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1a8cd8] focus:outline-offset-0 transition-all duration-300">
                  <img src="/twitter.svg" alt="Twitter" className="h-5 w-5" />
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
