const prisma = require('../db/prisma');

exports.createPerson = async (data) => {
    return await prisma.person.create({ data });
};

exports.getPersonById = async (id) => {
    return await prisma.person.findUnique({
        where: { id },
    });
};

exports.getAllPersons = async () => {
    return await prisma.person.findMany();
};

exports.updatePerson = async (id, data) => {
    return await prisma.person.update({
        where: { id },
        data,
    });
};

exports.deletePerson = async (id) => {
    return await prisma.person.delete({
        where: { id },
    });
};


exports.updateManyPersons = async (filter, data) => {
    return await prisma.person.updateMany({
        where: filter,
        data,
    });
};
