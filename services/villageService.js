const prisma = require('../db/prisma');

exports.createVillage = async (data) => {
    return await prisma.village.create({ data });
};


exports.getVillageById = async (id) => {
    const village = await prisma.village.findUnique({
        where: { id },
        include: {
            chakola: {
                select: {
                    name: true
                }
            },
            families: {
                select: {
                    id: true,
                    mukhiyaName: true,
                    status: true,
                    currentAddress: true,
                    longitude: true,
                    latitude: true,
                    createdDate: true,
                    updatedDate: true,
                    economicStatus: true,
                    Person: {
                        select: {
                            gender: true,
                        }
                    }
                }
            }
        }
    });

    if (!village) return null;

    const genderCounts = await prisma.person.groupBy({
        by: ['gender'],
        where: {
            villageId: id
        },
        _count: {
            gender: true
        }
    });

    const villageGenderSummary = {
        MALE: 0,
        FEMALE: 0,
        OTHER: 0
    };

    genderCounts.forEach(g => {
        villageGenderSummary[g.gender] = g._count.gender;
    });


    const familyList = village.families.map(fam => {
        const genderCount = { MALE: 0, FEMALE: 0, OTHER: 0 };
        fam.Person.forEach(p => {
            genderCount[p.gender] += 1;
        });

        return {
            id: fam.id,
            mukhiyaName: fam.mukhiyaName,
            status: fam.status,
            currentAddress: fam.currentAddress,
            longitude: fam.longitude,
            latitude: fam.latitude,
            createdDate: fam.createdDate,
            updatedDate: fam.updatedDate,
            economicStatus: fam.economicStatus,
            genderCount
        };
    });
    return {
        id: village.id,
        name: village.name,
        villageMemberName: village.villageMemberName,
        mobileNumber: village.mobileNumber,
        age: village.age,
        email: village.email,
        tehsil: village.tehsil,
        district: village.district,
        state: village.state,
        isVillageHaveSchool: village.isVillageHaveSchool,
        isVillageHavePrimaryHealthCare: village.isVillageHavePrimaryHealthCare,
        isVillageHaveCommunityHall: village.isVillageHaveCommunityHall,
        longitude: village.longitude,
        latitude: village.latitude,
        choklaId: village.choklaId,
        chakolaName: village.chakola?.name || null,
        createdDate: village.createdDate,
        updatedDate: village.updatedDate,
        totalFamilies: village.families.length,
        genderCount: villageGenderSummary,
        families: familyList
    };
};

exports.getAllVillages = async (query) => {
    const {
        page = 1,
        limit = 10,
        name,
        district,
        state,
        tehsil,
        isVillageHaveSchool,
        isVillageHaveCommunityHall,
        isVillageHavePrimaryHealthCare,
        choklaId,
    } = query;

    const skip = (page - 1) * limit;
    const where = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (district) where.district = { contains: district, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (tehsil) where.tehsil = { contains: tehsil, mode: 'insensitive' };
    if (choklaId) where.choklaId = choklaId;
    if (isVillageHaveSchool !== undefined) where.isVillageHaveSchool = isVillageHaveSchool === 'true';
    if (isVillageHaveCommunityHall !== undefined) where.isVillageHaveCommunityHall = isVillageHaveCommunityHall === 'true';
    if (isVillageHavePrimaryHealthCare !== undefined) where.isVillageHavePrimaryHealthCare = isVillageHavePrimaryHealthCare === 'true';

    const [villages, total] = await Promise.all([
        prisma.village.findMany({
            where,
            skip: Number(skip),
            take: Number(limit),
            include: {
                families: true,
                chakola: true,
            },
        }),
        prisma.village.count({ where }),
    ]);

    return {
        data: villages,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit),
        }
    };
};

exports.updateVillage = async (id, data) => {
    return await prisma.village.update({
        where: { id },
        data,
    });
};

exports.deleteVillage = async (id) => {
    return await prisma.village.delete({
        where: { id },
    });
};


exports.getVillageWithChokhlaId = async (chokhlaID) => {

    return await prisma.village.findMany({
        where: { choklaId: chokhlaID }
    })
}  