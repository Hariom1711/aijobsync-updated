/*
  Warnings:

  - You are about to drop the column `skills` on the `MasterProfile` table. All the data in the column will be lost.
  - The `languages` column on the `MasterProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."Feedback" DROP CONSTRAINT "Feedback_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MasterProfile" DROP CONSTRAINT "MasterProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- AlterTable
ALTER TABLE "public"."MasterProfile" DROP COLUMN "skills",
ADD COLUMN     "completeness" INTEGER DEFAULT 0,
ADD COLUMN     "coreSkills" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "softSkills" TEXT[],
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tools" TEXT[],
DROP COLUMN "languages",
ADD COLUMN     "languages" JSONB;

-- AddForeignKey
ALTER TABLE "public"."MasterProfile" ADD CONSTRAINT "MasterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "public"."Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
