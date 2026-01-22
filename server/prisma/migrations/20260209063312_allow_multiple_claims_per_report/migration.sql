/*
  Warnings:

  - A unique constraint covering the columns `[reportId,claimerId]` on the table `Claim` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Claim_reportId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Claim_reportId_claimerId_key" ON "Claim"("reportId", "claimerId");
