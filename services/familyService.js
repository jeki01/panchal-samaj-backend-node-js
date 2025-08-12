const prisma = require('../db/prisma');

exports.createFamily = async (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error("Invalid input. Data is missing or not an object.");
    }
    try {
        const result = await prisma.$transaction(async (tx) => {
            const family = await tx.family.create({
                data: {
                    permanentAddress: data.permanentAddress || null,
                    permanentFamilyState: data.permanentFamilyState,
                    permanentFamilyDistrict: data.permanentFamilyDistrict,
                    permanentFamilyPincode: data.permanentFamilyPincode,
                    permanentFamilyVillage: data.permanentFamilyVillage,
                    currentAddress: data.currentAddress,
                    currentFamilyState: data.currentFamilyState,
                    currentFamilyDistrict: data.currentFamilyDistrict,
                    currentFamilyPincode: data.currentFamilyPincode,
                    currentFamilyVillage: data.currentFamilyVillage,
                    economicStatus: data.economicStatus,
                    status: data.status || null,
                    villageId: data.villageId,
                    chakolaId: data.chakolaId,
                    mukhiyaName: data.mukhiyaName,
                    anyComment: data.anyComment || null,
                    longitude: data.longitude,
                    latitude: data.latitude
                },
            });


            const membersWithFamilyId = data.members.map(({ ...member }) => {
                return {
                    ...member,
                    dateOfBirth: new Date(member.dateOfBirth),
                    familyId: family.id,
                    villageId: family.villageId
                };
            });

            await tx.person.createMany({
                data: membersWithFamilyId,
                skipDuplicates: true,
            });

            const persons = await tx.person.findMany({
                where: { familyId: family.id },
            });

            return {
                family,
                persons,
            };
        });

        return { success: true, data: result };

    } catch (error) {
        console.error("Error creating family and members:", error);
        return { success: false, error };
    }
};


exports.getFamilyById = async (id) => {
    return await prisma.family.findUnique({
        where: { id },
        include: {
            Person: true,
        },
    });


};

exports.getAllFamilies = async (query) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdDate',
        sortOrder = 'desc',
        mukhiyaName,
        villageId,
        choklaId,
        vehicleType,
        incomeSource,
        familyHealthInsurance,
        hasOwnHouse,
        familyIncomeMin,
        familyIncomeMax,
        createdFrom,
        createdTo,
        vehicleTypeList,
    } = query;

    const skip = (page - 1) * limit;
    const where = {};

    if (mukhiyaName) where.mukhiyaName = { contains: mukhiyaName, mode: 'insensitive' };
    if (villageId) where.villageId = villageId;
    if (choklaId) where.choklaId = choklaId;
    if (vehicleType) where.vehicleType = vehicleType;
    if (incomeSource) where.incomeSource = { contains: incomeSource, mode: 'insensitive' };
    if (familyHealthInsurance !== undefined) where.familyHealthInsurance = familyHealthInsurance === 'true';
    if (hasOwnHouse !== undefined) where.hasOwnHouse = hasOwnHouse === 'true';

    // Range filters
    if (familyIncomeMin || familyIncomeMax) {
        where.familyIncome = {};
        if (familyIncomeMin) where.familyIncome.gte = parseFloat(familyIncomeMin);
        if (familyIncomeMax) where.familyIncome.lte = parseFloat(familyIncomeMax);
    }

    if (createdFrom || createdTo) {
        where.createdDate = {};
        if (createdFrom) where.createdDate.gte = new Date(createdFrom);
        if (createdTo) where.createdDate.lte = new Date(createdTo);
    }

    if (vehicleTypeList) {
        const types = vehicleTypeList.split(',').map(t => t.trim());
        where.vehicleType = { in: types };
    }

    const [families, total] = await Promise.all([
        prisma.family.findMany({
            where,
            skip: Number(skip),
            take: Number(limit),
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                members: true,
                village: true,
                chakola: true,
            },
        }),
        prisma.family.count({ where }),
    ]);

    return {
        data: families,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit),
        }
    };
};


exports.updateFamily = async (familyId, payload) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Update Family details
        const updatedFamily = await tx.family.update({
            where: { id: familyId },
            data: {
                mukhiyaName: payload.mukhiyaName,
                status: payload.status,
                economicStatus: payload.economicStatus,
                villageId: payload.villageId,
                chakolaId: payload.chakolaId,
                longitude: payload.longitude,
                latitude: payload.latitude,
                anyComment: payload.anyComment,
                permanentFamilyDistrict: payload.permanentFamilyDistrict,
                permanentFamilyState: payload.permanentFamilyState,
                permanentFamilyPincode: payload.permanentFamilyPincode,
                permanentAddress: payload.permanentAddress,
                permanentFamilyVillage: payload.permanentFamilyVillage,
                currentFamilyDistrict: payload.currentFamilyDistrict,
                currentFamilyState: payload.currentFamilyState,
                currentFamilyPincode: payload.currentFamilyPincode,
                currentAddress: payload.currentAddress,
                currentFamilyVillage: payload.currentFamilyVillage,
            },
        });

        // 2. Loop through members: update if valid id, else create new
        for (const member of payload.members) {
            // If id is missing or starts with "member-", treat as new
            const isValidId = member.id && !member.id.startsWith("member-");

            if (isValidId) {
                // Check if person with id exists
                const personExists = await tx.person.findUnique({ where: { id: member.id } });
                if (!personExists) {
                    throw new Error(`Person with id ${member.id} not found in the database.`);
                }

                // Update existing member
                await tx.person.update({
                    where: { id: member.id },
                    data: {
                        firstName: member.firstName,
                        lastName: member.lastName,
                        dateOfBirth: new Date(member.dateOfBirth),
                        age: member.age,
                        gender: member.gender,
                        relation: member.relation,
                        maritalStatus: member.maritalStatus,
                        gotra: member.gotra,
                        disability: member.disability,
                        bloodGroup: member.bloodGroup,
                        mobileNumber: member.mobileNumber,
                        email: member.email,
                        personPermanentAddress: member.personPermanentAddress || "",
                        personPermanentState: member.personPermanentState || "",
                        personPermanentDistrict: member.personPermanentDistrict || "",
                        personPermanentPincode: member.personPermanentPincode || "",
                        personPermanentVillage: member.personPermanentVillage || "",
                        personCurrentAddress: member.personCurrentAddress || "",
                        personCurrentState: member.personCurrentState || "",
                        personCurrentDistrict: member.personCurrentDistrict || "",
                        personCurrentPincode: member.personCurrentPincode || "",
                        personCurrentVillage: member.personCurrentVillage || "",
                        isCurrentAddressInIndia: member.isCurrentAddressInIndia,
                        currentCountry: member.currentCountry,
                        isStudent: member.isStudent,
                        educationLevel: member.educationLevel,
                        classCompleted: member.classCompleted,
                        currentClass: member.currentClass,
                        collegeCourse: member.collegeCourse,
                        institutionName: member.institutionName,
                        enrollmentStatus: member.enrollmentStatus,
                        schoolName: member.schoolName,
                        higherEducationType: member.higherEducationType,
                        currentEducationCity: member.currentEducationCity,
                        currentEducationCountry: member.currentEducationCountry,
                        isHelpRequiredFromSamaj: member.isHelpRequiredFromSamaj,
                        isCurrentlyEnrolled: member.isCurrentlyEnrolled,
                        dropoutReason: member.dropoutReason,
                        educationMode: member.educationMode,
                        isStudyingAbroad: member.isStudyingAbroad,
                        scholarshipReceived: member.scholarshipReceived,
                        scholarshipDetails: member.scholarshipDetails,
                        boardOrUniversity: member.boardOrUniversity,
                        yearOfPassing: member.yearOfPassing,
                        fieldOfStudy: member.fieldOfStudy,
                        isEmployed: member.isEmployed,
                        occupationType: member.occupationType,
                        employmentStatus: member.employmentStatus,
                        monthlyIncome: member.monthlyIncome,
                        incomeSourceCountry: member.incomeSourceCountry,
                        incomeSourceCountryName: member.incomeSourceCountryName,
                        countryName: member.countryName,
                        jobCategory: member.jobCategory,
                        employerOrganizationName: member.employerOrganizationName,
                        isGovernmentJob: member.isGovernmentJob,
                        jobPosition: member.jobPosition,
                        jobType: member.jobType,
                        workExperienceYears: member.workExperienceYears,
                        isSelfEmployed: member.isSelfEmployed,
                        selfEmployedJobType: member.selfEmployedJobType,
                        nameOfBusiness: member.nameOfBusiness,
                        businessCategory: member.businessCategory,
                        sizeOfBusiness: member.sizeOfBusiness,
                        businessRegistration: member.businessRegistration,
                        willingToHirePeople: member.willingToHirePeople,
                        needsEmployees: member.needsEmployees,
                        isBusinessRegistered: member.isBusinessRegistered,
                        occupationState: member.occupationState,
                        occupationCity: member.occupationCity,
                        preferredJobLocation: member.preferredJobLocation,
                        preferredSector: member.preferredSector,
                        isOpenToRelocate: member.isOpenToRelocate,
                        workingHoursPerWeek: member.workingHoursPerWeek,
                        hasAdditionalSkills: member.hasAdditionalSkills,
                        jobSearchSector: member.jobSearchSector,
                        customJobSearchSector: member.customJobSearchSector,
                        wantsToGoAbroad: member.wantsToGoAbroad,
                        hasPassport: member.hasPassport,
                        livestock: member.livestock,
                        landOwned: member.landOwned,
                        houseType: member.houseType,
                        houseOwnership: member.houseOwnership,
                        hasElectricity: member.hasElectricity,
                        waterSource: member.waterSource,
                        hasToilet: member.hasToilet,
                        cookingFuel: member.cookingFuel,
                        hasHealthIssues: member.hasHealthIssues,
                        chronicDisease: member.chronicDisease,
                        isVaccinated: member.isVaccinated,
                        hasHealthInsurance: member.hasHealthInsurance,
                        isInterestedInFutureHealthPolicy: member.isInterestedInFutureHealthPolicy,
                        hasSmartphone: member.hasSmartphone,
                        hasInternet: member.hasInternet,
                        hasBankAccount: member.hasBankAccount,
                        hasJanDhan: member.hasJanDhan,
                        isMukhiya: member.isMukhiya,
                        welfareSchemes: member.welfareSchemes,
                        isInterestedInFutureSamuhikVivah: member.isInterestedInFutureSamuhikVivah,
                        vehicleType: member.vehicleType,
                        familyId: familyId,
                        villageId: member.villageId || null,
                    },
                });
            } else {
                // Create new member
                await tx.person.create({
                    data: {
                        firstName: member.firstName,
                        lastName: member.lastName,
                        dateOfBirth: new Date(member.dateOfBirth),
                        age: member.age,
                        gender: member.gender,
                        relation: member.relation,
                        maritalStatus: member.maritalStatus,
                        gotra: member.gotra,
                        disability: member.disability,
                        bloodGroup: member.bloodGroup,
                        mobileNumber: member.mobileNumber,
                        email: member.email,
                        personPermanentAddress: member.personPermanentAddress || "",
                        personPermanentState: member.personPermanentState || "",
                        personPermanentDistrict: member.personPermanentDistrict || "",
                        personPermanentPincode: member.personPermanentPincode || "",
                        personPermanentVillage: member.personPermanentVillage || "",
                        personCurrentAddress: member.personCurrentAddress || "",
                        personCurrentState: member.personCurrentState || "",
                        personCurrentDistrict: member.personCurrentDistrict || "",
                        personCurrentPincode: member.personCurrentPincode || "",
                        personCurrentVillage: member.personCurrentVillage || "",
                        isCurrentAddressInIndia: member.isCurrentAddressInIndia,
                        currentCountry: member.currentCountry,
                        isStudent: member.isStudent,
                        educationLevel: member.educationLevel,
                        classCompleted: member.classCompleted,
                        currentClass: member.currentClass,
                        collegeCourse: member.collegeCourse,
                        institutionName: member.institutionName,
                        enrollmentStatus: member.enrollmentStatus,
                        schoolName: member.schoolName,
                        higherEducationType: member.higherEducationType,
                        currentEducationCity: member.currentEducationCity,
                        currentEducationCountry: member.currentEducationCountry,
                        isHelpRequiredFromSamaj: member.isHelpRequiredFromSamaj,
                        isCurrentlyEnrolled: member.isCurrentlyEnrolled,
                        dropoutReason: member.dropoutReason,
                        educationMode: member.educationMode,
                        isStudyingAbroad: member.isStudyingAbroad,
                        scholarshipReceived: member.scholarshipReceived,
                        scholarshipDetails: member.scholarshipDetails,
                        boardOrUniversity: member.boardOrUniversity,
                        yearOfPassing: member.yearOfPassing,
                        fieldOfStudy: member.fieldOfStudy,
                        isEmployed: member.isEmployed,
                        occupationType: member.occupationType,
                        employmentStatus: member.employmentStatus,
                        monthlyIncome: member.monthlyIncome,
                        incomeSourceCountry: member.incomeSourceCountry,
                        incomeSourceCountryName: member.incomeSourceCountryName,
                        countryName: member.countryName,
                        jobCategory: member.jobCategory,
                        employerOrganizationName: member.employerOrganizationName,
                        isGovernmentJob: member.isGovernmentJob,
                        jobPosition: member.jobPosition,
                        jobType: member.jobType,
                        workExperienceYears: member.workExperienceYears,
                        isSelfEmployed: member.isSelfEmployed,
                        selfEmployedJobType: member.selfEmployedJobType,
                        nameOfBusiness: member.nameOfBusiness,
                        businessCategory: member.businessCategory,
                        sizeOfBusiness: member.sizeOfBusiness,
                        businessRegistration: member.businessRegistration,
                        willingToHirePeople: member.willingToHirePeople,
                        needsEmployees: member.needsEmployees,
                        isBusinessRegistered: member.isBusinessRegistered,
                        occupationState: member.occupationState,
                        occupationCity: member.occupationCity,
                        preferredJobLocation: member.preferredJobLocation,
                        preferredSector: member.preferredSector,
                        isOpenToRelocate: member.isOpenToRelocate,
                        workingHoursPerWeek: member.workingHoursPerWeek,
                        hasAdditionalSkills: member.hasAdditionalSkills,
                        jobSearchSector: member.jobSearchSector,
                        customJobSearchSector: member.customJobSearchSector,
                        wantsToGoAbroad: member.wantsToGoAbroad,
                        hasPassport: member.hasPassport,
                        livestock: member.livestock,
                        landOwned: member.landOwned,
                        houseType: member.houseType,
                        houseOwnership: member.houseOwnership,
                        hasElectricity: member.hasElectricity,
                        waterSource: member.waterSource,
                        hasToilet: member.hasToilet,
                        cookingFuel: member.cookingFuel,
                        hasHealthIssues: member.hasHealthIssues,
                        chronicDisease: member.chronicDisease,
                        isVaccinated: member.isVaccinated,
                        hasHealthInsurance: member.hasHealthInsurance,
                        isInterestedInFutureHealthPolicy: member.isInterestedInFutureHealthPolicy,
                        hasSmartphone: member.hasSmartphone,
                        hasInternet: member.hasInternet,
                        hasBankAccount: member.hasBankAccount,
                        hasJanDhan: member.hasJanDhan,
                        isMukhiya: member.isMukhiya,
                        welfareSchemes: member.welfareSchemes,
                        isInterestedInFutureSamuhikVivah: member.isInterestedInFutureSamuhikVivah,
                        vehicleType: member.vehicleType,
                        familyId: familyId,
                        villageId: member.villageId || null,
                    },
                });
            }
        }

        return updatedFamily;
    });
};



exports.deleteFamily = async (id) => {
    return await prisma.family.delete({
        where: { id },
    });
};

exports.updateManyFamilies = async (filter, data) => {
    return await prisma.family.updateMany({
        where: filter,
        data,
    });
};

