const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Step 1: Create Chakola
    const chakola = await prisma.chakola.create({
        data: {
            name: "Chakola A",
            adhyaksh: "Shyam Bhai",
            contactNumber: "9876543210",
            state: "Gujarat",
            district: "Surat",
            villageName: "Greenfield Village"
        }
    });

    // Step 2: Create Village
    const village = await prisma.village.create({
        data: {
            name: "Greenfield Village",
            choklaId: chakola.id,
            district: "Surat",
            state: "Gujarat"
        }
    });

    // Step 3: Create Family
    const family = await prisma.family.create({
        data: {
            mukhiyaName: "Ramesh Patel",
            currentAddress: "123 Main Street",
            status: "Active",
            economicStatus: "Middle",
            villageId: village.id,
            familyDistrict: "Surat",
            familyState: "Gujarat",
            familyPincode: "395001",
            permanentAddress: "loskd ksdksd"
        }
    });

    // Step 4: Create Person
    await prisma.person.create({
        data: {
            firstName: "Ramesh",
            lastName: "Patel",
            dateOfBirth: new Date("1980-05-12"),
            age: 44,
            gender: "MALE",
            relation: "Mukhiya",
            maritalStatus: "Married",
            gotra: "Vashishtha",
            disability: false,
            bloodGroup: "B+",
            mobileNumber: "9876543210",
            email: "ramesh@example.com",
            permanentAddress: "123 Main Street",
            currentAddress: "123 Main Street, Village Center",
            state: "Gujarat",
            district: "Surat",
            pincode: "395001",
            village: "Greenfield Village",
            isCurrentAddressInIndia: true,
            currentCountry: "India",
            isStudent: false,
            educationLevel: "Graduate",
            classCompleted: "12th",
            collegeCourse: "B.Com",
            institutionName: "Gujarat University",
            enrollmentStatus: "Completed",
            schoolName: "Varachha High School",
            higherEducationType: "UG",
            currentEducationCity: "Surat",
            currentEducationCountry: "India",
            isHelpRequiredFromSamaj: false,
            isCurrentlyEnrolled: false,
            educationMode: "Regular",
            isStudyingAbroad: false,
            scholarshipReceived: false,
            boardOrUniversity: "GSEB",
            yearOfPassing: 2000,
            fieldOfStudy: "Commerce",
            isEmployed: true,
            occupationType: "Business",
            employmentStatus: "Self-employed",
            monthlyIncome: 30000,
            incomeSourceCountry: false,
            workExperienceYears: 10,
            isSelfEmployed: true,
            selfEmployedJobType: "Retailer",
            nameOfBusiness: "Patel Kirana Store",
            businessCategory: "Retail",
            sizeOfBusiness: "Small",
            businessRegistration: true,
            willingToHirePeople: true,
            occupationState: "Gujarat",
            occupationCity: "Surat",
            preferredJobLocation: "Surat",
            isOpenToRelocate: false,
            workingHoursPerWeek: 60,
            hasAdditionalSkills: true,
            livestock: "Cow, Goat",
            landOwned: 2.5,
            houseType: "Pucca",
            houseOwnership: "Owned",
            hasElectricity: true,
            waterSource: "Well",
            hasToilet: true,
            cookingFuel: "LPG",
            hasHealthIssues: false,
            chronicDisease: "",
            isVaccinated: true,
            hasHealthInsurance: true,
            isInterestedInFutureHealthPolicy: false,
            hasSmartphone: true,
            hasInternet: true,
            hasBankAccount: true,
            hasJanDhan: true,
            isMukhiya: true,
            welfareSchemes: ["Scheme1", "Scheme2"],
            isInterestedInFutureSamuhikVivah: false,
            vehicleType: "TWO_WHEELER",
            familyId: family.id,
            villageId: village.id
        }
    });

    console.log("✅ Seed completed successfully.");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding data:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
