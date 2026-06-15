import mongoose, { Schema, models, model } from "mongoose";

export interface IInstitute {
  name: string;
  ownerEmail: string;
  plan: "free" | "basic" | "premium";
  active: boolean;
}

const InstituteSchema = new Schema<IInstitute>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerEmail: {
      type: String,
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Institute =
  models.Institute || model<IInstitute>("Institute", InstituteSchema);