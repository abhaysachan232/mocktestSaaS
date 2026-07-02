"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/schemas/reset-password";
import { resetPassword } from "@/services/auth";

export default function ResetPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await resetPassword(data.password);

      if (response.success) {
        reset();

        router.replace("/login");
      }
    } catch (error: unknown) {
      console.error(error);

      type ErrorResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null
          ? (error as ErrorResponse).response?.data?.message
          : undefined;

      alert(message ?? "Unable to reset password");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            New Password
          </label>

          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full rounded border p-2"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="w-full rounded border p-2"
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
