/*
  Warnings:

  - The values [CLOTHING,BOOKS,KEYS,BAGS,OTHER] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('DOCUMENTS', 'ELECTRONICS', 'BOOKS_AND_NOTES', 'ACCESSORIES', 'STATIONERY', 'OTHERS');
ALTER TABLE "Report" ALTER COLUMN "category" TYPE "CategoryType_new" USING ("category"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "public"."CategoryType_old";
COMMIT;
