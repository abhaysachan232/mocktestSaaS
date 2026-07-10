"use client";

import { useMemo, useState } from "react";

import TestBasicInfo from "./TestBasicInfo";
import SubjectSelector from "./SubjectSelector";
import SubjectTopics from "./SubjectTopics";
import SummaryCard from "./SummaryCard";

import { SUBJECTS } from "./data";

export default function CreateTestForm() {

  const [testName, setTestName] = useState("");

  const [language, setLanguage] = useState("Hindi");

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});

  const totalQuestions = useMemo(() => {
    return Object.values(topicCounts).reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );
  }, [topicCounts]);

  const handleSubjectChange = (subject: string) => {

    if (selectedSubjects.includes(subject)) {

      setSelectedSubjects(
        selectedSubjects.filter((s) => s !== subject)
      );

      const updated = { ...topicCounts };

      SUBJECTS[subject].forEach((topic) => {
        delete updated[topic];
      });

      setTopicCounts(updated);

    } else {

      setSelectedSubjects([
        ...selectedSubjects,
        subject,
      ]);

    }
  };

  const handleSubmit = () => {

    const payload = {

      testName,

      language,

      subjects: selectedSubjects.map((subject) => ({

        subject,

        topics: SUBJECTS[subject]
          .filter(
            (topic) => (topicCounts[topic] || 0) > 0
          )
          .map((topic) => ({
            topic,
            questionCount: topicCounts[topic],
          })),
      })),
    };

    console.log(payload);

    // POST API
  };

  return (

    <div className="grid lg:grid-cols-3 gap-6">

      <div className="lg:col-span-2 space-y-6">

        <TestBasicInfo
          testName={testName}
          setTestName={setTestName}
          language={language}
          setLanguage={setLanguage}
        />

        <SubjectSelector
          selectedSubjects={selectedSubjects}
          onToggle={handleSubjectChange}
        />

        <SubjectTopics
          selectedSubjects={selectedSubjects}
          topicCounts={topicCounts}
          setTopicCounts={setTopicCounts}
        />

      </div>

      <SummaryCard
        totalQuestions={totalQuestions}
        totalSubjects={selectedSubjects.length}
        onSubmit={handleSubmit}
      />

    </div>

  );
}