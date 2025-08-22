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

exports.getAllVillages = async () => {
    const villages = await prisma.village.findMany({
        select: {
            id: true,
            name: true,
            villageMemberName: true,
            mobileNumber: true,
            email: true,
            tehsil: true,
            district: true,
            state: true,
            createdDate: true,
            chakola: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                    families: true
                }
            },
            families: {
                select: {
                    id: true, // or other fields you need from families
                    _count: {
                        select: {
                            Person: true
                        }
                    }
                }
            }
        }
    });

    // Transform the data to match the interface
    const result = villages.map(village => {
        const memberCount = village.families.reduce(
            (sum, family) => sum + family._count.Person,
            0
        );

        return {
            id: village.id,
            name: village.name,
            villageMemberName: village.villageMemberName || '',
            mobileNumber: village.mobileNumber || '',
            email: village.email || '',
            tehsil: village.tehsil || '',
            district: village.district || '',
            state: village.state || '',
            families: village.families,
            chakolaName: village.chakola?.name || '',
            familyCount: village._count.families,
            memberCount: memberCount,
            createdDate: village.createdDate.toISOString()
        };
    });

    return { data: result };
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
    try {
        const villages = await prisma.village.findMany({
            where: { choklaId: chokhlaID },
            include: {
                families: {
                    select: {
                        _count: {
                            select: { Person: true }
                        }
                    }
                }
            }
        });

        return villages.map((village) => {
            const familyCount = village.families.length;
            const personCount = village.families.reduce(
                (sum, family) => sum + family._count.Person,
                0
            );

            return {
                id: village.id,
                name: village.name,
                villageMemberName: village.villageMemberName,
                mobileNumber: village.mobileNumber,
                email: village.email,
                tehsil: village.tehsil,
                district: village.district,
                state: village.state,
                age: village.age,
                isVillageHaveSchool: village.isVillageHaveSchool,
                isVillageHavePrimaryHealthCare: village.isVillageHavePrimaryHealthCare,
                isVillageHaveCommunityHall: village.isVillageHaveCommunityHall,
                createdDate: village.createdDate,
                familyCount,
                personCount
            };
        });
    } catch (error) {
        console.error("Error fetching villages by chokhlaId:", error);
        throw new Error("Unable to fetch villages for the given chokhla.");
    }
};
