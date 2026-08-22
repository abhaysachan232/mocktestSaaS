"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/reset-password";
import { resetPasswordAction } from "@/actions/resetPassword.actions";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { ROUTES } from "@/lib/constans";

export default function ResetPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const result = await resetPasswordAction(data.password);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    reset();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="New Password"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword?.message}
        />

        <SubmitButton
          loading={isSubmitting}
          text="Reset Password"
          loadingText="Resetting Password..."
        />
      </form>
    </div>
  );
}
