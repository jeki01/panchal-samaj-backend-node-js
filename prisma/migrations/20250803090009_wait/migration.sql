/*
  Warnings:

  - You are about to drop the column `permanentAddress` on the `village` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "family" ADD COLUMN     "permanentAddress" TEXT;

-- AlterTable
ALTER TABLE "village" DROP COLUMN "permanentAddress";
