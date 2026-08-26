"use client";

import { Menu, Flag } from "lucide-react";
import TestTitle from "./TestTitle";
import TestProgress from "./TestProgress";
import Timer from "./Timer";

interface TestHeaderProps {
  title: string;
  description: string | null;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  onMenuClick?: () => void;
  onSubmit?: () => void;
}

export default function TestHeader({
  title,
  description,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onMenuClick,
  onSubmit,
}: TestHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-5 sm:py-3 lg:px-6">
        
        {/* Desktop / Tablet */}
        <div className="hidden items-center gap-5 md:flex">
          <TestTitle
            title={title}
            subtitle={description}
          />

          <TestProgress
            current={currentQuestion}
            total={totalQuestions}
          />

          <Timer seconds={timeRemaining} />

          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.98]"
            >
              <Flag size={16} />
              Submit
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center gap-2.5">
            
            {onMenuClick && (
              <button
                type="button"
                onClick={onMenuClick}
                aria-label="Open question palette"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
              >
                <Menu size={20} />
              </button>
            )}

            <div className="min-w-0 flex-1">
              <TestTitle
                title={title}
                subtitle={description}
              />
            </div>

            <Timer seconds={timeRemaining} />
          </div>

          <div className="mt-2.5">
            <TestProgress
              current={currentQuestion}
              total={totalQuestions}
            />
          </div>
        </div>
      </div>
    </header>
  );
}