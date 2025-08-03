const prisma = require('../../db/prisma');
const chakolaService = require('../../services/chakolaService');
const villageService = require('../../services/villageService');
const { hashPassword } = require('../../utils/hash');

exports.getAllChakolas = async (req, res, next) => {
    try {
        const chakolas = await chakolaService.fetchAllChakolas();
        res.json(chakolas);
    } catch (err) {
        next(err);
    }
};

exports.getChokhlaById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const chokhla = await chakolaService.fetchChokhlaById(id);
        if (!chokhla) {
            return res.status(404).json({ message: `Chokhla with id ${id} not found.` });
        }
        res.json(chokhla);
    } catch (err) {
        next(err);
    }
};

exports.creteChokhla = async (req, res, next) => {
    const {
        name,
        adhyaksh,
        contactNumber,
        state,
        district,
        villageName,
        email,
        password
    } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const result = await prisma.$transaction(async (tx) => {
            const chokhla = await tx.chakola.create({
                data: {
                    name,
                    adhyaksh,
                    contactNumber,
                    state,
                    district,
                    villageName
                }
            });

            const user = await tx.user.create({
                data: {
                    fullName: name,
                    email,
                    choklaId: chokhla.id,
                    passwordHash: hashedPassword,
                    globalRole: 'CHOKHLA_MEMBER'
                }
            });

            return { chokhla, user };
        });

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};


exports.editChokhla = async (req, res, next) => {
    const data = req.body;
    try {
        const chokhla = await chakolaService.editChokhla(data);
        res.json(chokhla);
    } catch (err) {
        next(err);
    }
};

exports.getVillageWithChokhlaId = async (req, res, next) => {
    const chokhlaid = req.params.chokhlaid;
    try {
        const chokhla = await villageService.getVillageWithChokhlaId(chokhlaid);
        res.json(chokhla);
    } catch (err) {
        next(err);
    }
};



