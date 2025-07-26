const prisma = require('../db/prisma');

exports.createFamily = async (data) => {
    const family = await prisma.family.create({
        data: {
            currentAddress: data.currentAddress,
            economicStatus: data.economicStatus,
            status: data.status,
            villageId: data.villageId,
            chakolaId: data.choklaId,
            mukhiyaName: data.mukhiyaName

        }

    });



    const membersWithFamilyId = data.members.map(member => ({
        ...member,
        familyId: family.id,
    }));
    const person = await prisma.person.createMany({
        data: membersWithFamilyId
    })
    return { membersWithFamilyId, person }
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
    return await prisma.family.update({
        where: { id },
        data,
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
