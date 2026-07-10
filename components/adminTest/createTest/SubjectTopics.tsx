"use client";

import { SUBJECTS } from "./data";

interface Props {
  selectedSubjects: string[];
  topicCounts: Record<string, number>;
  setTopicCounts: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}

export default function SubjectTopics({
  selectedSubjects,
  topicCounts,
  setTopicCounts,
}: Props) {
  if (selectedSubjects.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
        <h3 className="text-xl font-semibold text-slate-700">
          No Subject Selected
        </h3>

        <p className="text-slate-500 mt-2">
          Select subjects above to configure topic-wise questions.
        </p>
      </div>
    );
  }

  const updateCount = (
    topic: string,
    value: string
  ) => {
    const num = Number(value);

    setTopicCounts((prev) => ({
      ...prev,
      [topic]: Math.max(
        0,
        Math.min(50, num)
      ),
    }));
  };

  return (
    <div className="space-y-8">

      {selectedSubjects.map((subject) => (

        <div
          key={subject}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">

            <h2 className="text-xl font-bold">

              {subject}

            </h2>

            <p className="text-blue-100 text-sm mt-1">

              Enter number of questions for each topic

            </p>

          </div>

          {/* Topics */}

          <div className="p-6 space-y-4">

            {SUBJECTS[subject].map((topic) => (

              <div
                key={topic}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-2xl p-4 hover:bg-slate-50 transition"
              >

                {/* Topic */}

                <div className="flex-1">

                  <h3 className="font-semibold text-slate-800">

                    {topic}

                  </h3>

                  <p className="text-sm text-slate-500">

                    Questions from this topic

                  </p>

                </div>

                {/* Input */}

                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      updateCount(
                        topic,
                        String(
                          Math.max(
                            0,
                            (topicCounts[topic] || 0) - 1
                          )
                        )
                      )
                    }
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-bold"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={topicCounts[topic] || 0}
                    onChange={(e) =>
                      updateCount(
                        topic,
                        e.target.value
                      )
                    }
                    className="w-24 text-center rounded-xl border border-slate-300 py-2 font-bold outline-none focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateCount(
                        topic,
                        String(
                          Math.min(
                            50,
                            (topicCounts[topic] || 0) + 1
                          )
                        )
                      )
                    }
                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold"
                  >
                    +
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      ))}

    </div>
  );
}