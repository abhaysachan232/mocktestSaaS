/*
  Warnings:

  - You are about to drop the column `dob` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobile]` on the table `Coaching` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `Coaching` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_mobile_key";

-- AlterTable
ALTER TABLE "Coaching" ADD COLUMN     "mobile" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dob",
DROP COLUMN "mobile",
DROP COLUMN "name",
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mobile" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_mobile_key" ON "Student"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Coaching_mobile_key" ON "Coaching"("mobile");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
