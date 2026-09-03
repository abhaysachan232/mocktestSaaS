"use client";

import { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";

import { ExamFormValues } from "@/schemas/exam";

type Subject = {
  id: string;
  name: string;
  topics: {
    id: string;
    name: string;
  }[];
};

type Props = {
  control: Control<ExamFormValues>;
  subjects: Subject[];
  errors: FieldErrors<ExamFormValues>;
};

export default function SubjectTopicSelector({ control, subjects, errors }: Props) {
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(
    null,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Select Subjects & Topics
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select a subject and then choose the topics included in this exam.
        </p>
      </div>

      <Controller
        name="subjectIds"
        control={control}
        render={({ field: subjectField }) => (
          <Controller
            name="topicIds"
            control={control}
            render={({ field: topicField }) => {
              const selectedSubjectIds = subjectField.value ?? [];
              const selectedTopicIds = topicField.value ?? [];

              const handleSubjectChange = (subjectId: string) => {
                const isSelected = selectedSubjectIds.includes(subjectId);

                if (isSelected) {
                  /*
                   * Remove subject
                   */
                  subjectField.onChange(
                    selectedSubjectIds.filter((id) => id !== subjectId),
                  );

                  /*
                   * Remove all topics belonging
                   * to this subject.
                   */
                  const subject = subjects.find(
                    (item) => item.id === subjectId,
                  );

                  if (subject) {
                    const subjectTopicIds = subject.topics.map(
                      (topic) => topic.id,
                    );

                    topicField.onChange(
                      selectedTopicIds.filter(
                        (topicId) => !subjectTopicIds.includes(topicId),
                      ),
                    );
                  }

                  /*
                   * Collapse this subject.
                   */
                  if (expandedSubjectId === subjectId) {
                    setExpandedSubjectId(null);
                  }

                  return;
                }

                /*
                 * Select subject.
                 */
                subjectField.onChange([...selectedSubjectIds, subjectId]);

                /*
                 * Automatically open selected subject.
                 */
                setExpandedSubjectId(subjectId);
              };

              const handleTopicChange = (topicId: string) => {
                const isSelected = selectedTopicIds.includes(topicId);

                if (isSelected) {
                  topicField.onChange(
                    selectedTopicIds.filter((id) => id !== topicId),
                  );
                } else {
                  topicField.onChange([...selectedTopicIds, topicId]);
                }
              };

              return (
                <div className="space-y-3">
                  {subjects.map((subject) => {
                    const subjectSelected = selectedSubjectIds.includes(
                      subject.id,
                    );

                    const expanded = expandedSubjectId === subject.id;

                    const selectedTopicsCount = subject.topics.filter((topic) =>
                      selectedTopicIds.includes(topic.id),
                    ).length;

                    return (
                      <div
                        key={subject.id}
                        className={`overflow-hidden rounded-xl border transition-all ${
                          subjectSelected
                            ? "border-indigo-300"
                            : "border-gray-200"
                        }`}
                      >
                        {/* =========================
                            SUBJECT HEADER
                        ========================== */}
                        <div
                          className={`flex items-center gap-3 p-4 ${
                            subjectSelected ? "bg-indigo-50" : "bg-white"
                          }`}
                        >
                          {/* Subject Checkbox */}
                          <button
                            type="button"
                            onClick={() => handleSubjectChange(subject.id)}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                              subjectSelected
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-gray-300 bg-white"
                            }`}
                            aria-label={`Select ${subject.name}`}
                          >
                            {subjectSelected && (
                              <Check size={13} strokeWidth={3} />
                            )}
                          </button>

                          {/* Subject Name */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!subjectSelected) {
                                handleSubjectChange(subject.id);
                                return;
                              }

                              setExpandedSubjectId(
                                expanded ? null : subject.id,
                              );
                            }}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {subject.name}
                                </div>

                                <div className="mt-0.5 text-xs text-gray-500">
                                  {subject.topics.length}{" "}
                                  {subject.topics.length === 1
                                    ? "topic"
                                    : "topics"}
                                </div>
                              </div>

                              {subjectSelected && selectedTopicsCount > 0 && (
                                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                                  {selectedTopicsCount} selected
                                </span>
                              )}
                            </div>
                          </button>

                          {/* Expand Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!subjectSelected) {
                                handleSubjectChange(subject.id);
                                return;
                              }

                              setExpandedSubjectId(
                                expanded ? null : subject.id,
                              );
                            }}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-gray-700"
                            aria-label={
                              expanded ? "Collapse topics" : "Expand topics"
                            }
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* =========================
                            TOPICS
                        ========================== */}
                        {subjectSelected && expanded && (
                          <div className="border-t border-indigo-100 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  Select Topics
                                </p>

                                <p className="mt-0.5 text-xs text-gray-500">
                                  Choose topics for {subject.name}
                                </p>
                              </div>

                              {selectedTopicsCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const subjectTopicIds = subject.topics.map(
                                      (topic) => topic.id,
                                    );

                                    topicField.onChange(
                                      selectedTopicIds.filter(
                                        (id) => !subjectTopicIds.includes(id),
                                      ),
                                    );
                                  }}
                                  className="text-xs font-medium text-gray-500 hover:text-red-600"
                                >
                                  Clear
                                </button>
                              )}
                            </div>

                            {subject.topics.length === 0 ? (
                              <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center">
                                <p className="text-sm text-gray-500">
                                  No topics available for this subject.
                                </p>
                              </div>
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {subject.topics.map((topic) => {
                                  const topicSelected =
                                    selectedTopicIds.includes(topic.id);

                                  return (
                                    <button
                                      key={topic.id}
                                      type="button"
                                      onClick={() =>
                                        handleTopicChange(topic.id)
                                      }
                                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                                        topicSelected
                                          ? "border-indigo-300 bg-indigo-50"
                                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                      }`}
                                    >
                                      {/* Checkbox */}
                                      <span
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                          topicSelected
                                            ? "border-indigo-600 bg-indigo-600 text-white"
                                            : "border-gray-300 bg-white"
                                        }`}
                                      >
                                        {topicSelected && (
                                          <Check size={11} strokeWidth={3} />
                                        )}
                                      </span>

                                      {/* Topic */}
                                      <span
                                        className={`text-sm ${
                                          topicSelected
                                            ? "font-medium text-indigo-700"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {topic.name}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
        )}
      />

      {/* Errors */}
      {errors.subjectIds && (
        <p className="mt-2 text-sm text-red-500">{errors.subjectIds.message}</p>
      )}

      {errors.topicIds && (
        <p className="mt-1 text-sm text-red-500">{errors.topicIds.message}</p>
      )}
    </div>
  );
}
