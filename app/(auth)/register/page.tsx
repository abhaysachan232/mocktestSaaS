"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "./action";
import { RegisterSchema, registerSchema } from "@/schemas/register";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { ROUTES } from "@/lib/constans";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      // ✅ Register
      const result = await registerUser(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      // ✅ Auto Login
      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.error("Account created but login failed");
        return;
      }
      toast.success("Account created & logged in ✅");

      // ✅ Redirect
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 border">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600">Create Account</h1>

          <p className="text-gray-500 mt-3">
            Start your exam preparation today
          </p>
        </div>
        <Toaster />
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="Full Name"
            name="name"
            register={register}
            error={errors.name?.message}
            placeholder="Enter full name"
          />

          <InputField
            label="Email"
            name="email"
            register={register}
            error={errors.email?.message}
            placeholder="Enter email"
          />

          <InputField
            label="Mobile Number"
            name="mobile"
            register={register}
            error={errors.mobile?.message}
            placeholder="Enter mobile number"
          />

          <InputField
            type="date"
            label="Date of Birth"
            name="dob"
            register={register}
            error={errors.dob?.message}
          />

          <InputField
            type="password"
            label="Password"
            name="password"
            register={register}
            error={errors.password?.message}
            placeholder="Enter password"
          />

          <SubmitButton
            loading={isSubmitting}
            loadingText="Creating Account..."
            text="Create Account"
          />
        </form>

        {/* Login */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
