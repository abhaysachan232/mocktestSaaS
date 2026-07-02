/*
  Warnings:

  - You are about to drop the column `userId` on the `Coaching` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Coaching_userId_key";

-- AlterTable
ALTER TABLE "Coaching" DROP COLUMN "userId";
