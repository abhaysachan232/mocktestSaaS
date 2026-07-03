"use client";

import { InputHTMLAttributes } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputFieldProps<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
}

export default function InputField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  ...props
}: InputFieldProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={`text-sm font-medium text-gray-700 ${label? "block" : "hidden"}`}>
        {label}
      </label>

      <input
        id={name}
        {...register(name)}
        {...props}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-black"
        }`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
