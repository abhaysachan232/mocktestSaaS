"use server";

import Link from "next/link";
import type { JSONContent } from "@tiptap/react";

import { getQuestions } from "@/actions/question.actions";
import DeleteQuestionButton from "@/components/questions/DeleteQuestionButton";
import RichContentRenderer from "@/components/editor/RichContentRenderer";

export default async function QuestionsPage() {
  const result = await getQuestions();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Questions
              </h1>

              <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {result.data.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Manage your question bank
            </p>
          </div>

          <Link
            href="/questions/new"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              rounded-lg
              bg-slate-900
              px-4
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-slate-800
            "
          >
            <span className="mr-1.5 text-lg leading-none">+</span>
            Create Question
          </Link>
        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        {result.data.length === 0 ? (
          <div
            className="
              flex
              min-h-[320px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-6
              text-center
            "
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              ?
            </div>

            <h2 className="text-base font-semibold text-slate-900">
              No questions found
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Create your first question to start building your question bank.
            </p>

            <Link
              href="/questions/new"
              className="
                mt-5
                rounded-lg
                bg-slate-900
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-slate-800
              "
            >
              Create Question
            </Link>
          </div>
        ) : (
          /* =====================================================
             QUESTION LIST
          ===================================================== */
          <div className="space-y-5">
            {result.data.map((question, index) => (
              <article
                key={question.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition
                  hover:border-slate-300
                  hover:shadow-md
                "
              >
                {/* =================================================
                    QUESTION HEADER
                ================================================= */}
                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-200
                    bg-slate-50/80
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Question number */}
                    <span
                      className="
                        flex
                        h-8
                        min-w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-900
                        px-2
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      Q{index + 1}
                    </span>

                    {/* Subject */}
                    <span
                      className="
                        rounded-md
                        bg-blue-50
                        px-2.5
                        py-1.5
                        text-xs
                        font-medium
                        text-blue-700
                      "
                    >
                      {question.subject.name}
                    </span>

                    {/* Topic */}
                    <span
                      className="
                        rounded-md
                        bg-slate-100
                        px-2.5
                        py-1.5
                        text-xs
                        font-medium
                        text-slate-600
                      "
                    >
                      {question.topic.name}
                    </span>

                    {/* Type */}
                    {question.type === "SINGLE_CHOICE" ? (
                      <span
                        className="
                          rounded-full
                          bg-emerald-50
                          px-2.5
                          py-1.5
                          text-xs
                          font-medium
                          text-emerald-700
                        "
                      >
                        Single Choice
                      </span>
                    ) : (
                      <span
                        className="
                          rounded-full
                          bg-violet-50
                          px-2.5
                          py-1.5
                          text-xs
                          font-medium
                          text-violet-700
                        "
                      >
                        Multiple Choice
                      </span>
                    )}
                  </div>

                  {/* Question ID */}
                  <span className="font-mono text-[11px] text-slate-400">
                    {question.id}
                  </span>
                </div>

                {/* =================================================
                    QUESTION CONTENT
                ================================================= */}
                <div className="px-5 py-5 sm:px-6">
                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-4
                      sm:px-5
                    "
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Question
                      </span>
                    </div>

                    <div className="min-w-0 break-words">
                      <RichContentRenderer
                        content={question.content as JSONContent}
                        compact
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    OPTIONS
                ================================================= */}
                <div className="px-5 pb-5 sm:px-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Options
                    </span>

                    <span className="text-xs text-slate-400">
                      {question.options.length} options
                    </span>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={option.id}
                        className={`
                          rounded-xl
                          border
                          p-3.5
                          transition
                          ${
                            option.isCorrect
                              ? "border-emerald-300 bg-emerald-50/70"
                              : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          {/* Option letter */}
                          <span
                            className={`
                              flex
                              h-7
                              w-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              text-xs
                              font-bold
                              ${
                                option.isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white text-slate-600 ring-1 ring-slate-200"
                              }
                            `}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </span>

                          {/* Option content */}
                          <div className="min-w-0 flex-1 break-words">
                            <RichContentRenderer
                              content={option.content as JSONContent}
                              compact
                            />

                            {option.isCorrect && (
                              <div className="mt-2 text-[11px] font-semibold text-emerald-700">
                                ✓ Correct answer
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* =================================================
                    SOLUTION
                ================================================= */}
                {question.solution && (
                  <div className="px-5 pb-5 sm:px-6">
                    <div
                      className="
                        rounded-xl
                        border
                        border-amber-200
                        bg-amber-50/50
                        px-4
                        py-4
                        sm:px-5
                      "
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs">
                          💡
                        </span>

                        <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                          Solution
                        </span>
                      </div>

                      <div className="min-w-0 break-words">
                        <RichContentRenderer
                          content={question.solution as JSONContent}
                          compact
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    FOOTER / ACTIONS
                ================================================= */}
                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-slate-200
                    bg-slate-50/60
                    px-5
                    py-3.5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-6
                  "
                >
                  <span className="text-xs text-slate-400">
                    Question ID:{" "}
                    <span className="font-mono">{question.id}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/questions/${question.id}/edit`}
                      className="
                        inline-flex
                        h-8
                        items-center
                        justify-center
                        rounded-md
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-xs
                        font-medium
                        text-slate-700
                        shadow-sm
                        transition
                        hover:border-slate-300
                        hover:bg-slate-50
                      "
                    >
                      Edit
                    </Link>

                    <DeleteQuestionButton id={question.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}
        {result.data.length > 0 && (
          <div className="pb-4 text-center text-xs text-slate-400">
            Showing {result.data.length} question
            {result.data.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
