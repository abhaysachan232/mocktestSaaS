"use client";

import { Flag, Menu } from "lucide-react";

import TestTitle from "./TestTitle";
import TestProgress from "./TestProgress";
import Timer from "./Timer";

interface TestHeaderProps {
  testName: string;
  description?: string | null;
  currentQuestion: number;
  totalQuestions: number;
  remainingSeconds: number;
  onMenuClick?: () => void;
  onSubmit?: () => void;
}

export default function TestHeader({
  testName,
  description,
  currentQuestion,
  totalQuestions,
  remainingSeconds,
  onMenuClick,
  onSubmit,
}: TestHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div
        className="
          mx-auto w-full max-w-7xl
          px-3
          py-2
          sm:px-4 sm:py-2.5
          md:px-5
          lg:px-6 lg:py-3
          landscape:py-1.5
          md:landscape:py-2
        "
      >
        {/* ================================================= */}
        {/* MAIN HEADER ROW */}
        {/* ================================================= */}

        <div
          className="
            flex min-w-0 items-center
            gap-2
            sm:gap-3
            lg:gap-4
          "
        >
          {/* ----------------------------------------------- */}
          {/* MENU */}
          {/* ----------------------------------------------- */}

          {onMenuClick ? (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open question palette"
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-700
                transition-colors
                hover:bg-slate-50
                active:bg-slate-100
                md:hidden
              "
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          ) : null}

          {/* ----------------------------------------------- */}
          {/* TITLE */}
          {/* ----------------------------------------------- */}

          <div className="min-w-0 flex-1">
            <TestTitle title={testName} subtitle={description} />
          </div>

          {/* ----------------------------------------------- */}
          {/* PROGRESS - TABLET / DESKTOP */}
          {/* ----------------------------------------------- */}

          <div
            className="
              hidden
              w-[150px]
              shrink-0
              sm:block
              lg:w-[190px]
              xl:w-[230px]
            "
          >
            <TestProgress current={currentQuestion} total={totalQuestions} />
          </div>

          {/* ----------------------------------------------- */}
          {/* TIMER */}
          {/* ----------------------------------------------- */}

          <Timer seconds={remainingSeconds} />

          {/* ----------------------------------------------- */}
          {/* SUBMIT */}
          {/* ----------------------------------------------- */}

          {onSubmit ? (
            <button
              type="button"
              onClick={onSubmit}
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-3
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition
                hover:shadow-md
                active:scale-[0.98]

                sm:h-10
                sm:px-3.5
                sm:text-sm

                md:h-11
                md:px-4

                landscape:h-9
                landscape:px-2.5
                landscape:text-xs

                md:landscape:h-10
              "
            >
              <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />

              <span className="hidden sm:inline">Submit</span>
            </button>
          ) : null}
        </div>

        {/* ================================================= */}
        {/* MOBILE PROGRESS */}
        {/* ================================================= */}

        <div
          className="
            mt-2
            sm:mt-2.5
            sm:hidden
            landscape:hidden
          "
        >
          <TestProgress current={currentQuestion} total={totalQuestions} />
        </div>

        {/* ================================================= */}
        {/* MOBILE LANDSCAPE PROGRESS */}
        {/* ================================================= */}

        <div
          className="
            mt-1.5
            hidden
            landscape:block
            sm:landscape:hidden
          "
        >
          <TestProgress current={currentQuestion} total={totalQuestions} />
        </div>
      </div>
    </header>
  );
}
