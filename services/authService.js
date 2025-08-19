const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};

const createUser = async ({ email, passwordHash, fullName, choklaId, globalRole, mobileNumber }) => {
    return await prisma.user.create({
        data: {
            email,
            passwordHash,
            fullName,
            choklaId,
            globalRole, mobileNumber
        }
    });
};

const listOfUsers = async () => {
    return await prisma.user.findMany();
};

const updateUserRefreshToken = async (userId, refreshToken, extraData = {}) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            refreshToken,
            ...extraData
        }
    });
};

const clearUserRefreshToken = async (userId, extraData = {}) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            refreshToken: null,
            ...extraData
        }
    });
};


const toggleUserActiveStatus = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            isActive: !user.isActive
        }
    });

    return updatedUser;
};
module.exports = {
    findUserByEmail,
    createUser,
    updateUserRefreshToken,
    clearUserRefreshToken,
    listOfUsers,
    toggleUserActiveStatus
};
