const prisma = require('../db/prisma');

exports.fetchAllChakolas = async () => {
    return await prisma.chakola.findMany();
};
exports.fetchChokhlaById = async (id) => {
    return await prisma.chakola.findUnique({
        where: { id }, // assuming id is an integer
    });
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