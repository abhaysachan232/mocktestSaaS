"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseWatchProps,
  useWatch,
} from "react-hook-form";
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

export default function TopicSelector({ control, subjects, errors }: Props) {
  const selectedSubjectIds = useWatch({
    control,
    name: "subjectIds",
  });

  const availableTopics = subjects
    .filter((subject) => selectedSubjectIds?.includes(subject.id))
    .flatMap((subject) =>
      subject.topics.map((topic) => ({
        ...topic,
        subjectId: subject.id,
        subjectName: subject.name,
      })),
    );

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">Select Topics</h2>
      <p className="mb-4 text-sm text-gray-500">
        Select topics for the selected subjects.
      </p>

      {availableTopics.length === 0 ? (
        <p className="text-sm text-gray-500">
          Please select at least one subject.
        </p>
      ) : (
        <Controller
          name="topicIds"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              {availableTopics.map((topic) => {
                const checked = field.value?.includes(topic.id);

                return (
                  <label
                    key={topic.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border p-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          field.onChange([...field.value, topic.id]);
                        } else {
                          field.onChange(
                            field.value.filter((id) => id !== topic.id),
                          );
                        }
                      }}
                    />

                    <div>
                      <div className="font-medium">{topic.name}</div>

                      <div className="text-xs text-gray-500">
                        {topic.subjectName}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        />
      )}

      {errors.topicIds && (
        <p className="mt-2 text-sm text-red-500">{errors.topicIds.message}</p>
      )}
    </div>
  );
}
