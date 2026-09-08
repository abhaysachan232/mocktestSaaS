-- AlterTable
ALTER TABLE "AttemptAnswer" ADD COLUMN     "markedForReview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TestAttempt" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "TestAttempt_expiresAt_idx" ON "TestAttempt"("expiresAt");
