"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/forgot-password";
import { forgotPasswordAction } from "@/actions/forgotPassword.actions";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { ROUTES } from "@/lib/constans";

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
    const result = await forgotPasswordAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push(ROUTES.RESET_PASSWORD);
  };

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Forgot Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          label="Date of Birth"
          name="dob"
          type="date"
          register={register}
          error={errors.dob?.message}
        />

        <SubmitButton
          loading={isSubmitting}
          text="Continue"
          loadingText="Verifying..."
        />
      </form>
    </div>
  );
}
