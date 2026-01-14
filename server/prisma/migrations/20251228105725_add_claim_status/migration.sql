-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING';
