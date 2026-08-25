-- DropForeignKey
ALTER TABLE "TestQuestion" DROP CONSTRAINT "TestQuestion_questionId_fkey";

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
