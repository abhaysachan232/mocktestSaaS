import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MongoDB URI"
  );
}

interface MongooseGlobal {
  conn: mongoose.Mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseGlobal | undefined;
}

const cached: MongooseGlobal =
  global.mongoose || (global.mongoose = {
    conn: null,
    promise: null,
  });

export async function connectDB() {
  if (cached.conn)
    return cached.conn;

  if (!cached.promise) {
    cached.promise =
      mongoose.connect(
        MONGODB_URI
      );
  }

  cached.conn =
    await cached.promise;

  return cached.conn;
}