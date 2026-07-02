"use client";

import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  text: string;
  loadingText?: string;
  icon?: React.ReactNode;
}

export default function SubmitButton({
  loading = false,
  text,
  loadingText = "Processing...",
  icon,
  className = "",
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      className={`
        w-full
        bg-black
        hover:bg-gray-900
        text-white
        py-4
        rounded-2xl
        font-medium
        flex
        items-center
        justify-center
        gap-2
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </button>
  );
}
