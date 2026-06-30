"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/schemas/forgot-password";

import { forgotPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data);

      if (response.success) {
        router.push("/reset-password");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Forgot Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="border p-2 w-full"
          />

          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div>
          <input
            {...register("mobile")}
            placeholder="Mobile"
            className="border p-2 w-full"
          />

          <p className="text-red-500 text-sm">{errors.mobile?.message}</p>
        </div>

        <div>
          <input
            type="date"
            {...register("dob")}
            className="border p-2 w-full"
          />

          <p className="text-red-500 text-sm">{errors.dob?.message}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Verifying..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
