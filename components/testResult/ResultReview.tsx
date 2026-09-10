"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Bookmark, Check, ChevronDown, X } from "lucide-react";
import type { ResultReviewQuestion } from "@/lib/actions/testResult.actions";

type FilterKey = "ALL" | "CORRECT" | "WRONG" | "UNATTEMPTED";

type ResultReviewProps = {
  questions: ResultReviewQuestion[];
};

function renderContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (content && typeof content === "object" && "text" in content) {
    return String((content as { text: unknown }).text);
  }
  return JSON.stringify(content);
}

function classifyQuestion(q: ResultReviewQuestion): Exclude<FilterKey, "ALL"> {
  if (!q.studentAnswer.isAttempted) return "UNATTEMPTED";
  return q.studentAnswer.isCorrect ? "CORRECT" : "WRONG";
}

export default function ResultReview({ questions }: ResultReviewProps) {
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const c = { CORRECT: 0, WRONG: 0, UNATTEMPTED: 0 };
    questions.forEach((q) => {
      c[classifyQuestion(q)] += 1;
    });
    return c;
  }, [questions]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return questions;
    return questions.filter((q) => classifyQuestion(q) === filter);
  }, [questions, filter]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterTab active={filter === "ALL"} onClick={() => setFilter("ALL")}>
          All ({questions.length})
        </FilterTab>
        <FilterTab active={filter === "CORRECT"} onClick={() => setFilter("CORRECT")} colorClass="text-emerald-700">
          Correct ({counts.CORRECT})
        </FilterTab>
        <FilterTab active={filter === "WRONG"} onClick={() => setFilter("WRONG")} colorClass="text-red-700">
          Wrong ({counts.WRONG})
        </FilterTab>
        <FilterTab active={filter === "UNATTEMPTED"} onClick={() => setFilter("UNATTEMPTED")} colorClass="text-slate-600">
          Unattempted ({counts.UNATTEMPTED})
        </FilterTab>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const status = classifyQuestion(q);
          const isOpen = expanded.has(q.id);

          return (
            <div key={q.id} className="overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => toggle(q.id)}
                className="flex w-full items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <StatusBadge status={status} />
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    Q{q.order}
                  </span>
                  <span className="truncate text-sm font-medium text-slate-800">
                    {renderContent(q.content)}
                  </span>
                  {q.studentAnswer.markedForReview && (
                    <Bookmark className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                  )}
                </div>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-4">
                  <p className="mb-4 text-sm leading-relaxed text-slate-900">
                    {renderContent(q.content)}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => {
                      const wasSelected = q.studentAnswer.selectedOptionIds.includes(
                        option.id,
                      );

                      let optionClass =
                        "border-slate-200 bg-white text-slate-700";
                      if (option.isCorrect) {
                        optionClass = "border-emerald-300 bg-emerald-50 text-emerald-800";
                      } else if (wasSelected && !option.isCorrect) {
                        optionClass = "border-red-300 bg-red-50 text-red-800";
                      }

                      return (
                        <div
                          key={option.id}
                          className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-sm ${optionClass}`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            {renderContent(option.content)}
                          </span>

                          <span className="flex shrink-0 items-center gap-2 text-xs font-semibold">
                            {option.isCorrect && (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <Check className="h-3.5 w-3.5" /> Correct answer
                              </span>
                            )}
                            {wasSelected && !option.isCorrect && (
                              <span className="flex items-center gap-1 text-red-600">
                                <X className="h-3.5 w-3.5" /> Your answer
                              </span>
                            )}
                            {wasSelected && option.isCorrect && (
                              <span className="text-emerald-600">Your answer</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {!q.studentAnswer.isAttempted && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <AlertCircle className="h-3.5 w-3.5" />
                      You didn&apos;t attempt this question.
                    </p>
                  )}

                  {q.solution != null && (
                    <div className="mt-4 rounded-lg bg-indigo-50 p-3.5 text-sm text-indigo-900">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-500">
                        Explanation
                      </p>
                      {renderContent(q.solution)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No questions in this category.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  colorClass = "text-slate-700",
  children,
}: {
  active: boolean;
  onClick: () => void;
  colorClass?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white"
          : `border-slate-200 bg-white hover:bg-slate-50 ${colorClass}`
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: Exclude<FilterKey, "ALL"> }) {
  if (status === "CORRECT") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-3 w-3" />
      </span>
    );
  }
  if (status === "WRONG") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
        <X className="h-3 w-3" />
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-300 text-white">
      <AlertCircle className="h-3 w-3" />
    </span>
  );
}
