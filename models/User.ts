import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  image?: string;
  role: "student" | "owner" | "admin";
  institute?: Types.ObjectId;
  course?: string;
  logo?: string;
  couponCode?: string;
  commission?: number;
  coachingId?: Types.ObjectId;
  isActive?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "owner", "admin"],
      default: "student",
    },
    institute: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
    },
    course: {
      type: String,
      enum: [
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
      ],
    },
    logo: {
      type: String,
    },
    couponCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    commission: {
      type: Number,
      default: 27,
    },
    coachingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({
  email: 1,
});

UserSchema.index({
  couponCode: 1,
});

UserSchema.index({
  coachingId: 1,
});

export const User = models.User || model<IUser>("User", UserSchema);
