/*
  Warnings:

  - Added the required column `updatedAt` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Feedback" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "userNote" TEXT;

-- AlterTable
ALTER TABLE "public"."Resume" ADD COLUMN     "docxUrl" TEXT,
ADD COLUMN     "jdId" TEXT,
ADD COLUMN     "matchId" TEXT,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."JobDescription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jdText" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "analysis" JSONB NOT NULL,
    "jobTitle" TEXT,
    "companyName" TEXT,
    "experienceLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProfileMatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jdId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "matchData" JSONB NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "potentialScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobDescription_userId_idx" ON "public"."JobDescription"("userId");

-- CreateIndex
CREATE INDEX "JobDescription_jobTitle_idx" ON "public"."JobDescription"("jobTitle");

-- CreateIndex
CREATE INDEX "JobDescription_createdAt_idx" ON "public"."JobDescription"("createdAt");

-- CreateIndex
CREATE INDEX "ProfileMatch_userId_idx" ON "public"."ProfileMatch"("userId");

-- CreateIndex
CREATE INDEX "ProfileMatch_jdId_idx" ON "public"."ProfileMatch"("jdId");

-- CreateIndex
CREATE INDEX "ProfileMatch_overallScore_idx" ON "public"."ProfileMatch"("overallScore");

-- CreateIndex
CREATE INDEX "ProfileMatch_createdAt_idx" ON "public"."ProfileMatch"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_resumeId_idx" ON "public"."Feedback"("resumeId");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "public"."Resume"("userId");

-- CreateIndex
CREATE INDEX "Resume_jdId_idx" ON "public"."Resume"("jdId");

-- CreateIndex
CREATE INDEX "Resume_matchId_idx" ON "public"."Resume"("matchId");

-- CreateIndex
CREATE INDEX "Resume_createdAt_idx" ON "public"."Resume"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."JobDescription" ADD CONSTRAINT "JobDescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileMatch" ADD CONSTRAINT "ProfileMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileMatch" ADD CONSTRAINT "ProfileMatch_jdId_fkey" FOREIGN KEY ("jdId") REFERENCES "public"."JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resume" ADD CONSTRAINT "Resume_jdId_fkey" FOREIGN KEY ("jdId") REFERENCES "public"."JobDescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resume" ADD CONSTRAINT "Resume_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."ProfileMatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
