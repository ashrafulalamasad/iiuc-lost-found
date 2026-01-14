/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ELECTRONICS', 'DOCUMENTS', 'ACCESSORIES', 'CLOTHING', 'BOOKS', 'KEYS', 'BAGS', 'OTHER');

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_claimerId_fkey";

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_finderId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "categoryId",
ADD COLUMN     "category" "CategoryType" NOT NULL;

-- DropTable
DROP TABLE "Category";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_finderId_fkey" FOREIGN KEY ("finderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_claimerId_fkey" FOREIGN KEY ("claimerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
