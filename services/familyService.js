const prisma = require('../db/prisma');

exports.createFamily = async (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error("Invalid input. Data is missing or not an object.");
    }
    try {
        const result = await prisma.$transaction(async (tx) => {
            const family = await tx.family.create({
                data: {
                    currentAddress: data.currentAddress,
                    economicStatus: data.economicStatus,
                    status: data.status || null,
                    villageId: data.villageId,
                    chakolaId: data.chakolaId,
                    mukhiyaName: data.mukhiyaName,
                    familyDistrict: data.familyDistrict,
                    familyState: data.familyState || '',   // ensure not undefined
                    familyPincode: data.familyPincode || '', // ensure not undefined
                    anyComment: data.anyComment || null
                },
            });
            console.log(family)

            const membersWithFamilyId = data.members.map(({ ...member }) => {

                return {
                    ...member,

                    familyId: family.id,
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

exports.updateFamily = async (id, data) => {
    const { members = [], ...familyData } = data;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get current member IDs from DB
            const existingMembers = await tx.person.findMany({
                where: { familyId: id },
                select: { id: true },
            });

            const existingIds = existingMembers.map((m) => m.id);
            const incomingIds = members.map((m) => m.id).filter(Boolean); // Defined only

            // 2. Delete members that are in DB but not in the new payload
            const toDelete = existingIds.filter(id => !incomingIds.includes(id));
            if (toDelete.length > 0) {
                await tx.person.deleteMany({
                    where: { id: { in: toDelete } }
                });
            }

            // 3. Update the Family record
            const updatedFamily = await tx.family.update({
                where: { id },
                data: familyData,
            });

            // 4. Upsert each member in parallel (update if ID exists, else create)
            await Promise.all(
                members.map((member) => {
                    if (member.id) {
                        // Update existing
                        return tx.person.update({
                            where: { id: member.id },
                            data: {
                                ...member,
                                familyId: id,
                            },
                        });
                    } else {
                        // Create new
                        return tx.person.create({
                            data: {
                                ...member,
                                familyId: id,
                            },
                        });
                    }
                })
            );

            // 5. Return updated family with all members
            return await tx.family.findUnique({
                where: { id },
                include: { Person: true },
            });
        });

        return {
            success: true,
            message: "Family and members updated successfully.",
            data: result,
        };

    } catch (error) {
        console.error("Update family error:", error);
        return {
            success: false,
            message: "Failed to update family details.",
            error: error?.message || error,
        };
    }
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
