const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};

const createUser = async ({ email, passwordHash, fullName, choklaId, globalRole }) => {
    return await prisma.user.create({
        data: {
            email,
            passwordHash,
            fullName,
            choklaId,
            globalRole
        }
    });
};

const listOfUsers = async () => {
    return await prisma.user.findMany()
};

const updateUserRefreshToken = async (userId, refreshToken) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    });
};

const clearUserRefreshToken = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
    });
};

module.exports = {
    findUserByEmail,
    createUser,
    updateUserRefreshToken,
    clearUserRefreshToken,
    listOfUsers
};
