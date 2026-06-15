import mongoose, {
  Schema,
  model,
  models,
  Types,
} from "mongoose";

export interface ISubjectScore {
  subject: string;

  correct: number;

  total: number;

  marks: number;

  totalMarks: number;

  percentage: number;
}

export interface IResult {
  student: Types.ObjectId;

  test: Types.ObjectId;

  answers: number[];

  score: number;

  totalMarks: number;

  percentage: number;

  rank: number;

  totalAttempts: number;

  timeTakenSecs: number;

  subjectScores: ISubjectScore[];
}

const SubjectScoreSchema =
  new Schema<ISubjectScore>(
    {
      subject: String,

      correct: Number,

      total: Number,

      marks: Number,

      totalMarks: Number,

      percentage: Number,
    },
    {
      _id: false,
    }
  );

const ResultSchema = new Schema<IResult>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    test: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    answers: [Number],

    score: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    rank: {
      type: Number,
      default: 0,
    },

    totalAttempts: {
      type: Number,
      default: 0,
    },

    timeTakenSecs: {
      type: Number,
      default: 0,
    },

    subjectScores: [SubjectScoreSchema],
  },
  {
    timestamps: true,
  }
);

ResultSchema.index({
  test: 1,
  score: -1,
});

export const Result =
  models.Result || model<IResult>("Result", ResultSchema);