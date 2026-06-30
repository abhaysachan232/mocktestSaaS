import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(
  payload: string | Buffer | Record<string, unknown>,
) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export const generateResetToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
      purpose: "password-reset",
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const verifyResetToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as {
    userId: string;
    purpose: string;
  };
};
