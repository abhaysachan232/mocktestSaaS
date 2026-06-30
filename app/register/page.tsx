"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "./action";
import { RegisterSchema, registerSchema } from "@/lib/validations/register";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { logAudit } from "@/lib/audit";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // ✅ Register
      const result = await registerUser(formData);

      if (!result.success) {
        const errorMessage =
          result.errors?.general?.[0] ||
          result.errors?.email?.[0] ||
          result.errors?.mobile?.[0] ||
          result.errors?.password?.[0] ||
          result.errors?.dob?.[0];
        toast.error(errorMessage || "Something went wrong");
        return;
      }

// await logAudit(
//   user.id,
//   "REGISTER"
// );

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
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
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
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>

            <input
              {...register("name")}
              placeholder="Enter full name"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p>{errors.name?.message as string}</p>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>

            <input
              {...register("email")}
              placeholder="Enter email"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email?.message as string}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium">Mobile Number</label>

            <input
              {...register("mobile")}
              placeholder="Enter mobile number"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.mobile?.message as string}
          </div>

          <div>
            <label className="text-sm font-medium">Date of Birth</label>

            <input
              type="date"
              {...register("dob")}
              placeholder="Enter mobile number"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.dob?.message as string}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>

            <input
              type="password"
              {...register("password")}
              placeholder="Enter password"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password?.message as string}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
