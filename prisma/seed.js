// const { PrismaClient, Gender } = require('@prisma/client');

// const prisma = new PrismaClient();

// function getRandomItem(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// async function main() {
//     for (let i = 1; i <= 14; i++) {
//         const chakola = await prisma.chakola.create({
//             data: {
//                 name: `Chakola ${i}`,
//                 adhyaksh: `Adhyaksh ${i}`,
//                 contactNumber: `98765432${String(i).padStart(2, '0')}`,
//                 state: 'Madhya Pradesh',
//                 district: `District ${i}`,
//                 villageName: `VillageName ${i}`,
//             },
//         });

//         for (let j = 1; j <= 5; j++) {
//             const village = await prisma.village.create({
//                 data: {
//                     name: `Village ${i}-${j}`,
//                     villageMemberName: `Member ${i}-${j}`,
//                     mobileNumber: `90000000${i}${j}`,
//                     age: 50,
//                     email: `village${i}${j}@example.com`,
//                     tehsil: `Tehsil ${i}`,
//                     district: `District ${i}`,
//                     state: 'Madhya Pradesh',
//                     choklaId: chakola.id,
//                 },
//             });

//             for (let k = 1; k <= 5; k++) {
//                 const family = await prisma.family.create({
//                     data: {
//                         mukhiyaName: `Mukhiya ${i}-${j}-${k}`,
//                         currentAddress: `Address ${i}-${j}-${k}`,
//                         status: 'Active',
//                         economicStatus: 'Middle Class',
//                         villageId: village.id,
//                     },
//                 });

//                 for (let l = 1; l <= 4; l++) {
//                     await prisma.person.create({
//                         data: {
//                             name: `Person ${i}-${j}-${k}-${l}`,
//                             aadhaarNumber: `12345678${i}${j}${k}${l}`,
//                             dateOfBirth: new Date(`1990-01-${(l % 28) + 1}`),
//                             age: 2025 - 1990,
//                             gender: getRandomItem([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
//                             relation: 'Family Member',
//                             maritalStatus: 'Single',
//                             religion: 'Hindu',
//                             caste: 'General',
//                             disability: false,
//                             bloodGroup: 'O+',
//                             mobileNumber: `99999999${l}${k}`,
//                             email: `person${i}${j}${k}${l}@example.com`,
//                             permanentAddress: `Village ${i}-${j}`,
//                             currentAddress: `Village ${i}-${j}`,
//                             isCurrentAddressInIndia: true,
//                             village: village.name,
//                             pincode: '462001',
//                             district: `District ${i}`,
//                             state: 'Madhya Pradesh',
//                             isStudent: l % 2 === 0,
//                             educationLevel: 'Graduate',
//                             classCompleted: '12',
//                             collegeCourse: 'B.A.',
//                             institutionName: 'Govt College',
//                             enrollmentStatus: 'Active',
//                             isEmployed: l % 2 !== 0,
//                             occupation: 'Farming',
//                             monthlyIncome: 12000 + l * 1000,
//                             incomeSource: 'Agriculture',
//                             isIncomeSourceInIndia: true,
//                             incomeSourceCountry: 'India',
//                             serviceType: 'Self-employed',
//                             landOwned: 2,
//                             livestock: 'Cows',
//                             houseType: 'Pucca',
//                             houseOwnership: 'Owned',
//                             hasElectricity: true,
//                             waterSource: 'Well',
//                             hasToilet: true,
//                             cookingFuel: 'LPG',
//                             hasHealthIssues: false,
//                             chronicDisease: '',
//                             isVaccinated: true,
//                             hasHealthInsurance: true,
//                             hasSmartphone: true,
//                             hasInternet: true,
//                             hasBankAccount: true,
//                             hasJanDhan: true,
//                             isMukhiya: false,
//                             welfareSchemes: ['PM-KISAN'],
//                             familyId: family.id,
//                             villageId: village.id,
//                         },
//                     });
//                 }
//             }
//         }
//     }

//     console.log('✅ Seeded 14 Chakolas, 70 Villages, 350 Families, 1400 People');
// }

// main()
//     .then(() => prisma.$disconnect())
//     .catch((e) => {
//         console.error('❌ Seed failed:', e);
//         prisma.$disconnect();
//         process.exit(1);
//     });
