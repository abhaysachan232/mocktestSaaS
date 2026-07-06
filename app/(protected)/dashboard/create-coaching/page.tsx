"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import {
  CoachingRegisterInput,
  coachingRegisterSchema,
} from "@/schemas/coaching";
import InputField from "@/components/ui/InputField";
import { api } from "@/lib/api";
import SubmitButton from "@/components/ui/SubmitButton";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constans";

export default function CreateCoachingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CoachingRegisterInput>({
    resolver: zodResolver(coachingRegisterSchema),
  });

  const onSubmit = async (data: CoachingRegisterInput) => {
    try {
      setLoading(true);
      setServerError("");
      setSuccess("");
      console.log("CreateCoachingPage", data);
      const response = await api.post("/api/dashboard/coaching", data);
      setSuccess(response.data.message);

      // reset();
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Create Coaching</h1>

            <p className="text-gray-500 mt-2">
              Create coaching login and coupon system
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("Validation Errors", errors);
          })}
          className=""
        >
          {success && (
            <div className="bg-green-100 p-2 text-green-700">{success}</div>
          )}

          {serverError && (
            <div className="bg-red-100 p-2 text-red-700">{serverError}</div>
          )}
          <div className="grid md:grid-cols-2 gap-5">
            <InputField
              type="file"
              label="Logo"
              name="logo"
              register={register}
              error={errors?.logo?.message as string}
            />
            <InputField
              label="Coaching Name"
              name="coachingName"
              register={register}
              error={errors.coachingName?.message}
              placeholder="Coaching Name"
            />
            <InputField
              label="Owner Name"
              name="ownerName"
              register={register}
              error={errors.ownerName?.message}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
            />
            <InputField
              label="Mobile"
              name="mobile"
              register={register}
              error={errors.mobile?.message}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password?.message}
            />
            <InputField
              label="Address"
              name="address"
              register={register}
              error={errors.address?.message}
            />
            <InputField
              label="ID Number"
              name="idNumber"
              register={register}
              error={errors.idNumber?.message}
            />
            <InputField
              type="file"
              label="ID Proof"
              name="idProof"
              register={register}
              error={errors?.idProof?.message as string}
            />
          </div>
          <SubmitButton
            className="mt-8"
            loading={isSubmitting}
            text="Create Coaching"
            loadingText="Creating Coaching..."
            icon={<Building2 size={20} />}
          />
        </form>
      </div>
    </div>
  );
}
