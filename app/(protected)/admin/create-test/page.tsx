"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
} from "lucide-react";

export default function CreateTestPage() {
  const [loading, setLoading] =
    useState(false);

  const exams = [
    "SSC CGL",
    "SSC GD",
    "SSC CHSL",
    "SSC MTS",
    "Railway Group D",
    "Railway NTPC",
    "Railway ALP",
    "UP Police",
    "Bihar Police",
    "Delhi Police",
    "UPSI",
    "Constable",
    "Bank PO",
    "Bank Clerk",
    "CTET",
    "Super TET",
  ];

  // Subject + Sub Topics
  const subjectTopics: Record<
    string,
    string[]
  > = {
    Math: [
      "Percentage",
      "Ratio",
      "Profit & Loss",
      "Simplification",
      "Geometry",
      "Trigonometry",
      "Algebra",
      "DI",
      "Average",
      "Time & Work",
      "Number System",
    ],

    Reasoning: [
      "Coding Decoding",
      "Blood Relation",
      "Puzzle",
      "Syllogism",
      "Analogy",
      "Series",
      "Direction",
      "Ranking",
    ],

    English: [
      "Grammar",
      "Vocabulary",
      "Reading Comprehension",
      "Sentence Improvement",
      "Error Detection",
    ],

    Hindi: [
      "व्याकरण",
      "पर्यायवाची",
      "विलोम",
      "मुहावरे",
      "संधि",
      "समास",
    ],

    GK: [
      "History",
      "Geography",
      "Polity",
      "Current Affairs",
      "Economics",
    ],

    GS: [
      "History",
      "Geography",
      "Polity",
      "Economics",
      "Science",
      "Current Affairs",
      "Static GK",
    ],

    Computer: [
      "MS Office",
      "Internet",
      "Hardware",
      "Software",
      "Networking",
      "Operating System",
    ],

    Physics: [
      "Motion",
      "Force",
      "Energy",
      "Electricity",
    ],

    Chemistry: [
      "Atom",
      "Acid Base",
      "Periodic Table",
      "Chemical Reaction",
    ],

    Biology: [
      "Cell",
      "Human Body",
      "Nutrition",
      "Disease",
    ],
  };

  const [testData, setTestData] =
    useState({
      exam: "",
      subject: "",
      subTopic: "",
      duration: "",
      totalMarks: "",
      language: "Hindi",
    });

  const [questions, setQuestions] =
    useState([
      {
        question: "",
        options: [
          "",
          "",
          "",
          "",
        ],
        correctAnswer: "",
        explanation: "",
      },
    ]);

  // Add Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          "",
          "",
          "",
          "",
        ],
        correctAnswer: "",
        explanation: "",
      },
    ]);
  };

  // Remove Question
  const removeQuestion = (
    index: number
  ) => {
    const updated =
      [...questions];

    updated.splice(index, 1);

    setQuestions(updated);
  };

  // Question Change
  const handleQuestionChange =
    (
      index: number,
      value: string
    ) => {
      const updated =
        [...questions];

      updated[index].question =
        value;

      setQuestions(updated);
    };

  // Option Change
  const handleOptionChange =
    (
      qIndex: number,
      oIndex: number,
      value: string
    ) => {
      const updated =
        [...questions];

      updated[qIndex].options[
        oIndex
      ] = value;

      setQuestions(updated);
    };

  // Correct Answer
  const handleCorrectAnswer =
    (
      qIndex: number,
      value: string
    ) => {
      const updated =
        [...questions];

      updated[
        qIndex
      ].correctAnswer = value;

      setQuestions(updated);
    };

  // Explanation
  const handleExplanation =
    (
      qIndex: number,
      value: string
    ) => {
      const updated =
        [...questions];

      updated[
        qIndex
      ].explanation = value;

      setQuestions(updated);
    };

  // Submit
  const handleSubmit =
    async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "/api/admin/tests/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              ...testData,
              questions,
            }),
          }
        );

        const data =
          await res.json();

        if (data.success) {
          alert(
            "Test Created Successfully 🚀"
          );

          setTestData({
            exam: "",
            subject: "",
            subTopic: "",
            duration: "",
            totalMarks: "",
            language:
              "Hindi",
          });

          setQuestions([
            {
              question: "",
              options: [
                "",
                "",
                "",
                "",
              ],
              correctAnswer:
                "",
              explanation:
                "",
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            Create Mock Test
          </h1>

          <p className="text-gray-500 mt-2">
            Create subject wise
            PYQ based tests
          </p>
        </div>

        {/* Test Details */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">

          {/* Exam */}
          <select
            value={testData.exam}
            onChange={(e) =>
              setTestData({
                ...testData,
                exam:
                  e.target.value,
              })
            }
            className="border p-4 rounded-2xl outline-none"
          >
            <option value="">
              Select Exam
            </option>

            {exams.map(
              (exam, index) => (
                <option
                  key={index}
                  value={exam}
                >
                  {exam}
                </option>
              )
            )}
          </select>

          {/* Subject */}
          <select
            value={
              testData.subject
            }
            onChange={(e) =>
              setTestData({
                ...testData,
                subject:
                  e.target.value,
                subTopic: "",
              })
            }
            className="border p-4 rounded-2xl outline-none"
          >
            <option value="">
              Select Subject
            </option>

            {Object.keys(
              subjectTopics
            ).map((subject) => (
              <option
                key={subject}
                value={subject}
              >
                {subject}
              </option>
            ))}
          </select>

          {/* Sub Topic */}
          <select
            disabled={
              !testData.subject
            }
            value={
              testData.subTopic
            }
            onChange={(e) =>
              setTestData({
                ...testData,
                subTopic:
                  e.target.value,
              })
            }
            className={`border p-4 rounded-2xl outline-none ${
              !testData.subject
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
          >
            <option value="">
              Select Sub Topic
            </option>

            {testData.subject &&
              subjectTopics[
                testData.subject
              ]?.map((topic) => (
                <option
                  key={topic}
                  value={topic}
                >
                  {topic}
                </option>
              ))}
          </select>

          {/* Language */}
          <select
            value={
              testData.language
            }
            onChange={(e) =>
              setTestData({
                ...testData,
                language:
                  e.target.value,
              })
            }
            className="border p-4 rounded-2xl outline-none"
          >
            <option value="Hindi">
              Hindi
            </option>

            <option value="English">
              English
            </option>

            <option value="Bilingual">
              Bilingual
            </option>
          </select>

          {/* Duration */}
          <input
            type="number"
            placeholder="Duration (Minutes)"
            value={
              testData.duration
            }
            onChange={(e) =>
              setTestData({
                ...testData,
                duration:
                  e.target.value,
              })
            }
            className="border p-4 rounded-2xl outline-none"
          />

          {/* Total Marks */}
          <input
            type="number"
            placeholder="Total Marks"
            value={
              testData.totalMarks
            }
            onChange={(e) =>
              setTestData({
                ...testData,
                totalMarks:
                  e.target.value,
              })
            }
            className="border p-4 rounded-2xl outline-none"
          />
        </div>

        {/* Questions */}
        <div className="space-y-10">
          {questions.map(
            (q, qIndex) => (
              <div
                key={qIndex}
                className="bg-gray-50 border rounded-3xl p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Question{" "}
                    {qIndex + 1}
                  </h2>

                  {questions.length >
                    1 && (
                    <button
                      onClick={() =>
                        removeQuestion(
                          qIndex
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl"
                    >
                      <Trash2
                        size={18}
                      />
                    </button>
                  )}
                </div>

                {/* Question */}
                <textarea
                  placeholder="Enter Question"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full border p-4 rounded-2xl outline-none mb-6"
                />

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-5">
                  {q.options.map(
                    (
                      option,
                      oIndex
                    ) => (
                      <input
                        key={oIndex}
                        type="text"
                        placeholder={`Option ${
                          oIndex + 1
                        }`}
                        value={option}
                        onChange={(
                          e
                        ) =>
                          handleOptionChange(
                            qIndex,
                            oIndex,
                            e.target
                              .value
                          )
                        }
                        className="border p-4 rounded-2xl outline-none"
                      />
                    )
                  )}
                </div>

                {/* Correct Answer */}
                <div className="mt-6">
                  <select
                    value={
                      q.correctAnswer
                    }
                    onChange={(e) =>
                      handleCorrectAnswer(
                        qIndex,
                        e.target.value
                      )
                    }
                    className="border p-4 rounded-2xl outline-none w-full"
                  >
                    <option value="">
                      Select Correct
                      Answer
                    </option>

                    {q.options.map(
                      (
                        option,
                        index
                      ) => (
                        <option
                          key={index}
                          value={option}
                        >
                          {option ||
                            `Option ${
                              index + 1
                            }`}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Explanation */}
                <textarea
                  placeholder="Answer Explanation"
                  value={
                    q.explanation
                  }
                  onChange={(e) =>
                    handleExplanation(
                      qIndex,
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full border p-4 rounded-2xl outline-none mt-6"
                />
              </div>
            )
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-10">
          <button
            onClick={addQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center gap-2"
          >
            <Plus size={18} />
            Add Question
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-2xl"
          >
            {loading
              ? "Creating..."
              : "Create Test"}
          </button>
        </div>
      </div>
    </div>
  );
}