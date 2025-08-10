/*
  Warnings:

  - You are about to drop the column `familyDistrict` on the `family` table. All the data in the column will be lost.
  - You are about to drop the column `familyPincode` on the `family` table. All the data in the column will be lost.
  - You are about to drop the column `familyState` on the `family` table. All the data in the column will be lost.
  - You are about to drop the column `currentAddress` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `permanentAddress` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `person` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "family" DROP CONSTRAINT "family_villageId_fkey";

-- DropForeignKey
ALTER TABLE "person" DROP CONSTRAINT "person_familyId_fkey";

-- AlterTable
ALTER TABLE "family" DROP COLUMN "familyDistrict",
DROP COLUMN "familyPincode",
DROP COLUMN "familyState",
ADD COLUMN     "currentFamilyDistrict" TEXT,
ADD COLUMN     "currentFamilyPincode" TEXT,
ADD COLUMN     "currentFamilyState" TEXT,
ADD COLUMN     "currentFamilyVillage" TEXT,
ADD COLUMN     "permanentFamilyDistrict" TEXT,
ADD COLUMN     "permanentFamilyPincode" TEXT,
ADD COLUMN     "permanentFamilyState" TEXT,
ADD COLUMN     "permanentFamilyVillage" TEXT,
ALTER COLUMN "currentAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "person" DROP COLUMN "currentAddress",
DROP COLUMN "district",
DROP COLUMN "permanentAddress",
DROP COLUMN "pincode",
DROP COLUMN "state",
DROP COLUMN "village",
ADD COLUMN     "hasPassport" BOOLEAN DEFAULT false,
ADD COLUMN     "incomeSourceCountryName" TEXT,
ADD COLUMN     "isBusinessRegistered" BOOLEAN DEFAULT false,
ADD COLUMN     "isSeekingJob" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobSearchSector" TEXT,
ADD COLUMN     "personCurrentAddress" TEXT,
ADD COLUMN     "personCurrentDistrict" TEXT,
ADD COLUMN     "personCurrentPincode" TEXT,
ADD COLUMN     "personCurrentState" TEXT,
ADD COLUMN     "personCurrentVillage" TEXT,
ADD COLUMN     "personPermanentAddress" TEXT,
ADD COLUMN     "personPermanentDistrict" TEXT,
ADD COLUMN     "personPermanentPincode" TEXT,
ADD COLUMN     "personPermanentState" TEXT,
ADD COLUMN     "personPermanentVillage" TEXT,
ADD COLUMN     "preferredSector" TEXT,
ADD COLUMN     "wantsToGoAbroad" BOOLEAN DEFAULT false,
ALTER COLUMN "isCurrentAddressInIndia" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "family_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "village"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
