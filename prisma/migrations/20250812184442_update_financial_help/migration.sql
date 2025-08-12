-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('SUPER_ADMIN', 'VILLAGE_MEMBER', 'CHOKHLA_MEMBER');

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
    "lastLogin" TIMESTAMP(3),
    "lastLogout" TIMESTAMP(3),
    "villageId" TEXT,
    "mobileNumber" TEXT,

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
    "status" TEXT NOT NULL,
    "economicStatus" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "chakolaId" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "anyComment" TEXT,
    "permanentFamilyDistrict" TEXT,
    "permanentFamilyState" TEXT,
    "permanentFamilyPincode" TEXT,
    "permanentAddress" TEXT,
    "permanentFamilyVillage" TEXT,
    "currentFamilyDistrict" TEXT,
    "currentFamilyState" TEXT,
    "currentFamilyPincode" TEXT,
    "currentAddress" TEXT,
    "currentFamilyVillage" TEXT,

    CONSTRAINT "family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "relation" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "gotra" TEXT NOT NULL,
    "femaleGotra" TEXT,
    "disability" BOOLEAN NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "personPermanentAddress" TEXT,
    "personPermanentState" TEXT,
    "personPermanentDistrict" TEXT,
    "personPermanentPincode" TEXT,
    "personPermanentVillage" TEXT,
    "personCurrentAddress" TEXT,
    "personCurrentState" TEXT,
    "personCurrentDistrict" TEXT,
    "personCurrentPincode" TEXT,
    "personCurrentVillage" TEXT,
    "isCurrentAddressInIndia" BOOLEAN,
    "currentCountry" TEXT NOT NULL DEFAULT 'India',
    "isStudent" BOOLEAN NOT NULL,
    "educationLevel" TEXT NOT NULL,
    "classCompleted" TEXT NOT NULL,
    "currentClass" TEXT,
    "collegeCourse" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "enrollmentStatus" TEXT,
    "schoolName" TEXT,
    "higherEducationType" TEXT,
    "currentEducationCity" TEXT,
    "currentEducationCountry" TEXT,
    "isHelpRequiredFromSamaj" BOOLEAN NOT NULL,
    "isCurrentlyEnrolled" BOOLEAN,
    "dropoutReason" TEXT,
    "educationMode" TEXT,
    "isStudyingAbroad" BOOLEAN,
    "scholarshipReceived" BOOLEAN,
    "scholarshipDetails" TEXT,
    "boardOrUniversity" TEXT,
    "yearOfPassing" INTEGER,
    "fieldOfStudy" TEXT,
    "isEmployed" BOOLEAN NOT NULL DEFAULT false,
    "occupationType" TEXT,
    "employmentStatus" TEXT,
    "monthlyIncome" DOUBLE PRECISION,
    "incomeSourceCountry" BOOLEAN NOT NULL DEFAULT false,
    "countryName" TEXT,
    "preferredSector" TEXT,
    "jobCategory" TEXT,
    "employerOrganizationName" TEXT,
    "isGovernmentJob" BOOLEAN DEFAULT false,
    "jobPosition" TEXT,
    "jobType" TEXT,
    "workExperienceYears" INTEGER,
    "isSelfEmployed" BOOLEAN DEFAULT false,
    "selfEmployedJobType" TEXT,
    "nameOfBusiness" TEXT,
    "businessCategory" TEXT,
    "sizeOfBusiness" TEXT,
    "businessRegistration" BOOLEAN DEFAULT false,
    "willingToHirePeople" BOOLEAN DEFAULT false,
    "isSeekingJob" BOOLEAN NOT NULL DEFAULT false,
    "incomeSourceCountryName" TEXT,
    "jobSearchSector" TEXT,
    "wantsToGoAbroad" BOOLEAN DEFAULT false,
    "hasPassport" BOOLEAN DEFAULT false,
    "businessType" TEXT,
    "customBusinessType" TEXT,
    "numberOfEmployees" INTEGER,
    "needsEmployees" BOOLEAN DEFAULT false,
    "isBusinessRegistered" BOOLEAN DEFAULT false,
    "occupationState" TEXT,
    "occupationCity" TEXT,
    "preferredJobLocation" TEXT,
    "isOpenToRelocate" BOOLEAN DEFAULT false,
    "workingHoursPerWeek" INTEGER,
    "hasAdditionalSkills" BOOLEAN DEFAULT false,
    "livestock" TEXT NOT NULL,
    "landOwned" DOUBLE PRECISION NOT NULL,
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
    "isInterestedInFutureHealthPolicy" BOOLEAN NOT NULL DEFAULT false,
    "hasSmartphone" BOOLEAN NOT NULL,
    "hasInternet" BOOLEAN NOT NULL,
    "hasBankAccount" BOOLEAN NOT NULL,
    "hasJanDhan" BOOLEAN NOT NULL,
    "isMukhiya" BOOLEAN NOT NULL,
    "welfareSchemes" TEXT[],
    "isInterestedInFutureSamuhikVivah" BOOLEAN NOT NULL DEFAULT false,
    "vehicleType" TEXT NOT NULL,
    "isInterestedInFinancialAssistance" BOOLEAN,
    "govBenefitInterestfromsamaj" BOOLEAN,
    "familyId" TEXT NOT NULL,
    "villageId" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "customJobSearchSector" TEXT,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "village"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "village" ADD CONSTRAINT "village_choklaId_fkey" FOREIGN KEY ("choklaId") REFERENCES "chakola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "family_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "village"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "village"("id") ON DELETE SET NULL ON UPDATE CASCADE;
