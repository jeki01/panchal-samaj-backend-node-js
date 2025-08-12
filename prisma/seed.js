// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Chakola
    const chakola = await prisma.chakola.create({
        data: {
            name: 'Test Chakola',
            adhyaksh: 'Ramesh Patel',
            contactNumber: '9876543210',
            state: 'Gujarat',
            district: 'Ahmedabad',
            villageName: 'Rajpur',
        },
    });

    // 2. Create Village
    const village = await prisma.village.create({
        data: {
            name: 'Rajpur',
            villageMemberName: 'Mahesh Kumar',
            mobileNumber: '9999999999',
            age: 45,
            email: 'village@example.com',
            tehsil: 'Rajpur Tehsil',
            district: 'Ahmedabad',
            state: 'Gujarat',
            isVillageHaveSchool: true,
            isVillageHavePrimaryHealthCare: true,
            isVillageHaveCommunityHall: true,
            longitude: 72.5714,
            latitude: 23.0225,
            choklaId: chakola.id,
        },
    });

    // 3. Create Family
    const family = await prisma.family.create({
        data: {
            mukhiyaName: 'Suresh Kumar',
            status: 'Active',
            economicStatus: 'Middle',
            villageId: village.id,
            chakolaId: chakola.id,
            longitude: 72.5714,
            latitude: 23.0225,
            anyComment: 'No issues',
            permanentFamilyDistrict: 'Ahmedabad',
            permanentFamilyState: 'Gujarat',
            permanentFamilyPincode: '380001',
            permanentAddress: 'Main Street 12',
            permanentFamilyVillage: 'Rajpur',
            currentFamilyDistrict: 'Ahmedabad',
            currentFamilyState: 'Gujarat',
            currentFamilyPincode: '380002',
            currentAddress: 'Market Road 5',
            currentFamilyVillage: 'Rajpur',
        },
    });

    // 4. Create Person
    const person = await prisma.person.create({
        data: {
            firstName: 'Ravi',
            lastName: 'Shah',
            dateOfBirth: new Date('1990-05-15'),
            age: 35,
            gender: 'MALE',
            relation: 'Son',
            maritalStatus: 'Married',
            gotra: 'Kashyap',
            disability: false,
            bloodGroup: 'B+',
            mobileNumber: '8888888888',
            email: 'ravi@example.com',

            personPermanentAddress: 'Main Street 12',
            personPermanentState: 'Gujarat',
            personPermanentDistrict: 'Ahmedabad',
            personPermanentPincode: '380001',
            personPermanentVillage: 'Rajpur',

            personCurrentAddress: 'Market Road 5',
            personCurrentState: 'Gujarat',
            personCurrentDistrict: 'Ahmedabad',
            personCurrentPincode: '380002',
            personCurrentVillage: 'Rajpur',

            isCurrentAddressInIndia: true,

            isStudent: false,
            educationLevel: 'Graduate',
            classCompleted: 'Bachelors',
            currentClass: null,
            collegeCourse: 'B.Sc Computer Science',
            institutionName: 'Gujarat University',
            enrollmentStatus: 'Completed',
            isHelpRequiredFromSamaj: false,

            isCurrentlyEnrolled: false,
            isSeekingJob: true,

            isEmployed: true,
            occupationType: 'SERVICE',
            employmentStatus: 'Full-time',
            monthlyIncome: 40000,
            countryName: 'India',
            preferredSector: 'IT',
            jobCategory: 'Software Engineer',
            employerOrganizationName: 'TechCorp',
            jobPosition: 'Developer',
            jobType: 'Permanent',
            workExperienceYears: 10,

            livestock: 'Cows',
            landOwned: 2.5,
            houseType: 'Concrete',
            houseOwnership: 'Owned',
            hasElectricity: true,
            waterSource: 'Well',
            hasToilet: true,
            cookingFuel: 'Gas',

            hasHealthIssues: false,
            chronicDisease: 'None',
            isVaccinated: true,
            hasHealthInsurance: true,

            hasSmartphone: true,
            hasInternet: true,
            hasBankAccount: true,
            hasJanDhan: false,
            isMukhiya: false,
            welfareSchemes: ['PMAY', 'Ujjwala'],
            vehicleType: 'Two-Wheeler',

            familyId: family.id,
            villageId: village.id,
        },
    });

    // 5. Create User
    await prisma.user.create({
        data: {
            email: 'admin@example.com',
            passwordHash: 'hashed_password_here',
            choklaId: chakola.id,
            globalRole: 'SUPER_ADMIN',
            fullName: 'Admin User',
            villageId: village.id,
            mobileNumber: '7777777777',
        },
    });

    console.log('✅ Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
