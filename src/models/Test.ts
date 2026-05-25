import mongoose, {
  Schema,
  model,
  models,
  Types,
} from "mongoose";

/* =========================
   QUESTION INTERFACE
========================= */

export interface IQuestion {
  question: string;

  options: string[];

  // Fast Checking
  correctIndex: number;

  // Human Readable
  correctAnswer: string;

  explanation?: string;

  subject: string;

  subTopic: string;

  difficulty:
    | "Easy"
    | "Medium"
    | "Hard";

  examType: string;

  examYear?: number;

  shift?: string;

  language:
    | "Hindi"
    | "English"
    | "Bilingual";

  marks: number;

  negativeMarks: number;

  isPYQ: boolean;
}

/* =========================
   TEST INTERFACE
========================= */

export interface ITest {
  exam: string;

  subject: string;

  subTopic: string;

  institute?: Types.ObjectId;

  questions: IQuestion[];

  totalQuestions: number;

  durationMinutes: number;

  totalMarks: number;

  negativeMarking: number;

  language:
    | "Hindi"
    | "English"
    | "Bilingual";

  isActive: boolean;

  startTime?: Date;

  endTime?: Date;
}

/* =========================
   QUESTION SCHEMA
========================= */

const QuestionSchema =
  new Schema<IQuestion>(
    {
      question: {
        type: String,

        required: true,

        trim: true,
      },

      options: [
        {
          type: String,

          required: true,
        },
      ],

      // Correct Option Index
      correctIndex: {
        type: Number,

        required: true,
      },

      // Correct Answer Text
      correctAnswer: {
        type: String,

        required: true,
      },

      explanation: {
        type: String,

        default: "",
      },

      subject: {
        type: String,

        required: true,
      },

      subTopic: {
        type: String,

        required: true,
      },

      difficulty: {
        type: String,

        enum: [
          "Easy",
          "Medium",
          "Hard",
        ],

        default: "Medium",
      },

      examType: {
        type: String,

        required: true,
      },

      examYear: {
        type: Number,
      },

      shift: {
        type: String,
      },

      language: {
        type: String,

        enum: [
          "Hindi",
          "English",
          "Bilingual",
        ],

        default: "Hindi",
      },

      marks: {
        type: Number,

        default: 1,
      },

      negativeMarks: {
        type: Number,

        default: 0.25,
      },

      isPYQ: {
        type: Boolean,

        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

/* =========================
   AUTO SET correctAnswer
========================= */

QuestionSchema.pre(
  "validate",

  function (next) {
    if (
      this.options &&
      typeof this.correctIndex ===
        "number"
    ) {
      this.correctAnswer =
        this.options[
          this.correctIndex
        ];
    }

    next();
  }
);

/* =========================
   TEST SCHEMA
========================= */

const TestSchema =
  new Schema<ITest>(
    {
      exam: {
        type: String,

        required: true,
      },

      subject: {
        type: String,

        required: true,
      },

      subTopic: {
        type: String,

        required: true,
      },

      institute: {
        type:
          Schema.Types.ObjectId,

        ref: "Institute",
      },

      questions: [
        QuestionSchema,
      ],

      totalQuestions: {
        type: Number,

        required: true,
      },

      durationMinutes: {
        type: Number,

        required: true,
      },

      totalMarks: {
        type: Number,

        required: true,
      },

      negativeMarking: {
        type: Number,

        default: 0.25,
      },

      language: {
        type: String,

        enum: [
          "Hindi",
          "English",
          "Bilingual",
        ],

        default: "Hindi",
      },

      isActive: {
        type: Boolean,

        default: true,
      },

      startTime: {
        type: Date,
      },

      endTime: {
        type: Date,
      },
    },

    {
      timestamps: true,
    }
  );

/* =========================
   EXPORT MODEL
========================= */

export const Test =
  models.Test ||
  model<ITest>(
    "Test",
    TestSchema
  );