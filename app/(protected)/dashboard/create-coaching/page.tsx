"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import {
  CoachingRegisterInput,
  coachingRegisterSchema,
} from "@/schemas/coaching";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import ImageUpload from "@/components/ui/ImageUpload";
import { createCoaching } from "@/actions/coaching.actions";

const generateCoachingCode = (
  coachingName: string,
  ownerName: string,
  idNumber: string,
) => {
  const coachingPart = coachingName
    .trim()
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

  const ownerPart = ownerName
    .trim()
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

  const idPart = idNumber
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-4)
    .toUpperCase();

  return `${coachingPart}${ownerPart}${idPart}`;
};

export default function CreateCoachingPage() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CoachingRegisterInput>({
    resolver: zodResolver(coachingRegisterSchema),
  });
  const [coachingName, ownerName, idNumber] = useWatch({
    control,
    name: ["coachingName", "ownerName", "idNumber"],
  });
  const coachingCode =
    coachingName && ownerName && idNumber
      ? generateCoachingCode(coachingName, ownerName, idNumber)
      : "";

  useEffect(() => {
    if (!coachingCode) return;

    setValue("code", coachingCode, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [coachingCode, setValue]);

  const onSubmit = async (data: CoachingRegisterInput) => {
    try {
      setServerError("");
      setSuccess("");
      console.log("CreateCoachingPage", data);
      const response = await createCoaching(data)
      setSuccess(response.data.message);

      reset();
      // router.push(ROUTES.DASHBOARD);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unexpected error occurred");
      }
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
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Upload Coaching Logo"
                  folder={`coaching/${coachingCode}`}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.logo?.message as string}
                />
              )}
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
              label="Coaching Code"
              name="code"
              register={register}
              readOnly
              error={errors.coachingName?.message}
              placeholder="Coaching Name"
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
            <Controller
              name="idProof"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Upload Id Proof"
                  folder={`coaching/${coachingCode}`}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.logo?.message as string}
                />
              )}
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
