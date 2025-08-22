const prisma = require('../db/prisma');

exports.fetchAllChakolas = async () => {
    try {
        const chakolas = await prisma.chakola.findMany({
            include: {
                villages: {
                    include: {
                        _count: {
                            select: { families: true },
                        },
                        families: {
                            select: {
                                _count: {
                                    select: { Person: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        return chakolas.map((chakola) => {
            const villageCount = chakola.villages.length;
            const familyCount = chakola.villages.reduce(
                (sum, village) => sum + village._count.families,
                0
            );
            const memberCount = chakola.villages.reduce(
                (sum, village) =>
                    sum +
                    village.families.reduce(
                        (familySum, family) => familySum + family._count.Person,
                        0
                    ),
                0
            );

            return {
                id: chakola.id,
                name: chakola.name,
                adhyaksh: chakola.adhyaksh,
                contactNumber: chakola.contactNumber,
                state: chakola.state,
                district: chakola.district,
                villageName: chakola.villageName,
                createdDate: chakola.createdDate,
                updatedDate: chakola.updatedDate,
                villageCount,
                familyCount,
                memberCount,
            };
        });
    } catch (error) {
        console.error("Error fetching chakolas:", error);
        throw new Error("Unable to fetch chakola data.");
    }
};



exports.fetchChokhlaById = async (id) => {
    try {
        // First, fetch chakola (early exit if not found)
        const chakola = await prisma.chakola.findUnique({
            where: { id },
        });

        if (!chakola) {
            throw new Error(`Chakola with ID '${id}' not found`);
        }

        // Perform all other counts in parallel
        const [genderCounts, villageCount, familyCount, userCount] = await Promise.all([
            // More efficient: count males/females/other separately
            Promise.all([
                prisma.person.count({
                    where: {
                        gender: 'MALE',
                        villageRel: {
                            choklaId: id,
                        },
                    },
                }),
                prisma.person.count({
                    where: {
                        gender: 'FEMALE',
                        villageRel: {
                            choklaId: id,
                        },
                    },
                }),
                prisma.person.count({
                    where: {
                        gender: 'OTHER',
                        villageRel: {
                            choklaId: id,
                        },
                    },
                }),
            ]),
            prisma.village.count({
                where: { choklaId: id },
            }),
            prisma.family.count({
                where: {
                    village: { choklaId: id },
                },
            }),
            prisma.user.count({
                where: {
                    village: { choklaId: id },
                },
            }),
        ]);

        const [male, female, other] = genderCounts;

        return {
            ...chakola,
            stats: {
                genders: {
                    MALE: male,
                    FEMALE: female,
                    OTHER: other,
                },
                villageCount,
                familyCount,
                userCount,
            },
        };

    } catch (error) {
        console.error(`Error fetching chakola data for ID ${id}:`, error.message);
        throw new Error('Failed to fetch Chakola details. Please try again later.');
    }
};

exports.createChokhla = async (data) => {
    return await prisma.chakola.create({
        data
    });
};

exports.editChokhla = async (data) => {
    return await prisma.chakola.update({
        where: { id: data.id },
        data
    });
};