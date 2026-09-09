/*
  Warnings:

  - You are about to drop the column `coachingId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_coachingId_fkey";

-- DropIndex
DROP INDEX "User_coachingId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coachingId";

-- CreateTable
CREATE TABLE "UserCoaching" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coachingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCoaching_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserCoaching_userId_idx" ON "UserCoaching"("userId");

-- CreateIndex
CREATE INDEX "UserCoaching_coachingId_idx" ON "UserCoaching"("coachingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCoaching_userId_coachingId_key" ON "UserCoaching"("userId", "coachingId");

-- AddForeignKey
ALTER TABLE "UserCoaching" ADD CONSTRAINT "UserCoaching_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoaching" ADD CONSTRAINT "UserCoaching_coachingId_fkey" FOREIGN KEY ("coachingId") REFERENCES "Coaching"("id") ON DELETE CASCADE ON UPDATE CASCADE;
