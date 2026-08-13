import type {
  TestEngineData,
} from "@/components/test-engine/TestEngine";

export const testData: TestEngineData = {
  id: "ssc-cgl-demo",
  title: "SSC CGL Mock Test",
  subtitle: "General Intelligence & Reasoning",
  duration: 30,

  questions: [
    {
      id: "q1",
      question: "भारत की राजधानी क्या है?",
      options: [
        {
          id: "a",
          text: "मुंबई",
        },
        {
          id: "b",
          text: "नई दिल्ली",
        },
        {
          id: "c",
          text: "कोलकाता",
        },
        {
          id: "d",
          text: "चेन्नई",
        },
      ],
      correctAnswer: "b",
      marks: 2,
      negativeMarks: 0.5,
    },

    {
      id: "q2",
      question: "What is 15 × 4?",
      options: [
        {
          id: "a",
          text: "50",
        },
        {
          id: "b",
          text: "60",
        },
        {
          id: "c",
          text: "70",
        },
        {
          id: "d",
          text: "80",
        },
      ],
      correctAnswer: "b",
      marks: 2,
      negativeMarks: 0.5,
    },

    {
      id: "q3",
      question: "Which language is primarily used with React?",
      options: [
        {
          id: "a",
          text: "JavaScript",
        },
        {
          id: "b",
          text: "PHP",
        },
        {
          id: "c",
          text: "C",
        },
        {
          id: "d",
          text: "Java",
        },
      ],
      correctAnswer: "a",
      marks: 2,
      negativeMarks: 0.5,
    },

    {
      id: "q4",
      question: "Which of the following is a JavaScript framework/library?",
      options: [
        {
          id: "a",
          text: "React",
        },
        {
          id: "b",
          text: "MySQL",
        },
        {
          id: "c",
          text: "MongoDB",
        },
        {
          id: "d",
          text: "Nginx",
        },
      ],
      correctAnswer: "a",
      marks: 2,
      negativeMarks: 0.5,
    },

    {
      id: "q5",
      question: "What does HTML stand for?",
      options: [
        {
          id: "a",
          text: "Hyper Text Markup Language",
        },
        {
          id: "b",
          text: "High Text Machine Language",
        },
        {
          id: "c",
          text: "Hyper Transfer Markup Language",
        },
        {
          id: "d",
          text: "Home Tool Markup Language",
        },
      ],
      correctAnswer: "a",
      marks: 2,
      negativeMarks: 0.5,
    },
  ],
};