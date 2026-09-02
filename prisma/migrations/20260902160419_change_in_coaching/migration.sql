/*
  Warnings:

  - The values [MAINTINACE] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[idNumber]` on the table `Coaching` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Coaching` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'COACHING', 'SALES', 'MAINTENANCE', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "Coaching" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Coaching_idNumber_key" ON "Coaching"("idNumber");

-- CreateIndex
CREATE INDEX "Coaching_coachingName_idx" ON "Coaching"("coachingName");

-- CreateIndex
CREATE INDEX "Coaching_mobile_idx" ON "Coaching"("mobile");

-- CreateIndex
CREATE INDEX "Coaching_isActive_idx" ON "Coaching"("isActive");

-- CreateIndex
CREATE INDEX "User_coachingId_idx" ON "User"("coachingId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
