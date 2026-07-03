"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/login";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { MESSAGES, ROUTES } from "@/lib/constans";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

      if (response?.error) {
        toast.error(MESSAGES.INVALID_CREDENTIALS);
        return;
      }

      toast.success(MESSAGES.LOGIN_SUCCESS);
      router.replace(ROUTES.DASHBOARD);
      router.refresh();
    } catch {
      toast.error(MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Section */}
      <div className="relative hidden lg:flex w-1/2 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-center w-full p-20">
          <div className="max-w-lg text-white">
            <h1 className="text-6xl font-extrabold tracking-tight">
              Welcome Back 👋
            </h1>

            <p className="mt-6 text-xl text-blue-100">
              Access your courses, exams, results and continue your learning
              journey with our smart learning platform.
            </p>

            <div className="mt-12 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-wider text-blue-100">
                Secure Authentication
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Next.js • Prisma • PostgreSQL
              </h3>

              <p className="mt-4 text-blue-100">
                Fast, secure and scalable platform for online learning and
                assessments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="rounded-[32px] border border-slate-100 bg-white p-14 shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-7">
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="john@example.com"
                register={register}
                error={errors.email?.message}
              />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot Password?</Link>
                </div>

                <InputField
                  label=""
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  register={register}
                  error={errors.password?.message}
                />
              </div>

              <SubmitButton
                loading={isSubmitting}
                text="Sign In"
                loadingText="Signing In..."
              />
            </form>

            <div className="mt-8 text-center text-base text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href={ROUTES.REGISTER} className="text-sm font-medium text-blue-600 hover:text-blue-700">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
