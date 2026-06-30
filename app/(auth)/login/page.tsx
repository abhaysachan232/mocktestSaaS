"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/login";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError("");
      // 👉 NextAuth login
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!res?.error) {
        toast.success("Login successful");

        const session = await getSession();

        switch (session?.user?.role) {
          case "ADMIN":
            router.replace("/admin");
            break;

          case "COACHING":
            router.replace("/coaching");
            break;

          default:
            router.replace("/student");
        }

        router.refresh();

        // setError("Invalid credentials");
        // toast.error(res.error);
        // return;
      }

      // router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex w-1/2 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        {/* Blur Effects */}
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-center w-full p-20">
          <div className="max-w-lg text-white">
            <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
              Welcome Back 👋
            </h1>

            <p className="mt-6 text-xl leading-relaxed text-blue-100">
              Access your courses, exams, results and continue your learning
              journey with our smart learning platform.
            </p>

            <div className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <p className="text-sm uppercase tracking-wider text-blue-100">
                Secure Authentication
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Next.js • Prisma • PostgreSQL
              </h3>

              <p className="mt-4 text-blue-100">
                Fast, secure and scalable platform for online learning, exams
                and assessments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="rounded-[32px] bg-white border border-slate-100 p-14 shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-r from-blue-600 to-indigo-600 text-4xl font-bold text-white shadow-xl">
                A
              </div>
            </div>

            {/* Heading */}
            <div className="mt-8 text-center">
              <h2 className="text-4xl font-bold text-slate-900">Sign In</h2>

              <p className="mt-3 text-lg text-slate-500">
                Enter your credentials to continue
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-7">
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className="h-14 w-full rounded-2xl border border-slate-300 px-5 text-lg outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <input
                  type="password"
                  // name="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-2xl border border-slate-300 px-5 text-lg outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                {errors.password && <p>{errors.password.message}</p>}
              </div>

              {/* {error && (
                <p className="text-red-500">{ error }</p>
              )} */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-8 text-center text-base text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
