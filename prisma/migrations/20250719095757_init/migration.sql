-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('ADMIN', 'MEMBER', 'MODERATOR', 'GUEST');

-- CreateEnum
CREATE TYPE "OccupationType" AS ENUM ('AGRICULTURE', 'BUSINESS', 'SERVICE', 'LABOUR', 'STUDENT', 'UNEMPLOYED', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "choklaId" TEXT NOT NULL,
    "globalRole" "GlobalRole" NOT NULL,
    "fullName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chakola" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adhyaksh" TEXT,
    "contactNumber" TEXT,
    "state" TEXT,
    "district" TEXT,
    "villageName" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chakola_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "village" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "villageMemberName" TEXT,
    "mobileNumber" TEXT,
    "age" INTEGER,
    "email" TEXT,
    "tehsil" TEXT,
    "district" TEXT,
    "state" TEXT,
    "isVillageHaveSchool" BOOLEAN NOT NULL DEFAULT false,
    "isVillageHavePrimaryHealthCare" BOOLEAN NOT NULL DEFAULT false,
    "isVillageHaveCommunityHall" BOOLEAN NOT NULL DEFAULT false,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "choklaId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "village_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family" (
    "id" TEXT NOT NULL,
    "mukhiyaName" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "economicStatus" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "chakolaId" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,

    CONSTRAINT "family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "relation" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "caste" TEXT NOT NULL,
    "disability" BOOLEAN NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "isCurrentAddressInIndia" BOOLEAN NOT NULL,
    "currentCountry" TEXT NOT NULL DEFAULT 'India',
    "village" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isStudent" BOOLEAN NOT NULL,
    "educationLevel" TEXT NOT NULL,
    "classCompleted" TEXT NOT NULL,
    "currentClass" TEXT,
    "collegeCourse" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "enrollmentStatus" TEXT,
    "schoolName" TEXT,
    "higherEducationType" TEXT,
    "isEmployed" BOOLEAN NOT NULL,
    "occupation" TEXT NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,
    "incomeSource" TEXT NOT NULL,
    "isIncomeSourceInIndia" BOOLEAN NOT NULL,
    "incomeSourceCountry" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "landOwned" DOUBLE PRECISION NOT NULL,
    "livestock" TEXT NOT NULL,
    "houseType" TEXT NOT NULL,
    "houseOwnership" TEXT NOT NULL,
    "hasElectricity" BOOLEAN NOT NULL,
    "waterSource" TEXT NOT NULL,
    "hasToilet" BOOLEAN NOT NULL,
    "cookingFuel" TEXT NOT NULL,
    "hasHealthIssues" BOOLEAN NOT NULL,
    "chronicDisease" TEXT NOT NULL,
    "isVaccinated" BOOLEAN NOT NULL,
    "hasHealthInsurance" BOOLEAN NOT NULL,
    "hasSmartphone" BOOLEAN NOT NULL,
    "hasInternet" BOOLEAN NOT NULL,
    "hasBankAccount" BOOLEAN NOT NULL,
    "hasJanDhan" BOOLEAN NOT NULL,
    "isMukhiya" BOOLEAN NOT NULL,
    "welfareSchemes" TEXT[],
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "dropoutReason" TEXT,
    "familyId" TEXT NOT NULL,
    "villageId" TEXT,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "village" ADD CONSTRAINT "village_choklaId_fkey" FOREIGN KEY ("choklaId") REFERENCES "chakola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "family_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "village"("id") ON DELETE SET NULL ON UPDATE CASCADE;
