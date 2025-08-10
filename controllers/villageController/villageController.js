const { villageMemberMessage } = require('../../constant');
const prisma = require('../../db/prisma');
const villageService = require('../../services/villageService');
const { sendMessage } = require('../../services/whatsappService');
const { hashPassword } = require('../../utils/hash');


exports.createVillage = async (req, res, next) => {
    const {
        mobileNumber,
        name,
        villageMemberName,
        age,
        email,
        tehsil,
        district,
        state,
        isVillageHaveSchool,
        isVillageHavePrimaryHealthCare,
        isVillageHaveCommunityHall,
        longitude,
        latitude,
        password,
        chakola
    } = req.body;

    if (!chakola) {
        return res.status(400).json({ error: 'choklaId is required' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const result = await prisma.$transaction(async (tx) => {
            const village = await tx.village.create({
                data: {
                    name,
                    villageMemberName,
                    age,
                    email,
                    tehsil,
                    district,
                    state,
                    isVillageHaveSchool,
                    isVillageHavePrimaryHealthCare,
                    isVillageHaveCommunityHall,
                    longitude,
                    latitude,
                    mobileNumber,
                    choklaId: chakola.connect.id
                }
            });

            // Create user and link to the created village
            const user = await tx.user.create({
                data: {
                    fullName: name,
                    email,
                    choklaId: chakola.connect.id,
                    passwordHash: hashedPassword,
                    globalRole: 'VILLAGE_MEMBER',
                    villageId: village.id
                }
            });


            return { village, user };
        });
        let formattedNumber = mobileNumber;
        if (!formattedNumber.startsWith('91')) {
            formattedNumber = '91' + formattedNumber;
        }
        const message = villageMemberMessage(name, email, password);
        const whatsappResponse = await sendMessage(formattedNumber, message);

        if (!whatsappResponse.success) {
            console.warn('⚠️ WhatsApp message failed:', whatsappResponse.error.message);
        }
        res.status(201).json({
            ...result,
            whatsappSent: whatsappResponse.success,
        });

    } catch (err) {
        next(err);
    }
};



exports.getVillageById = async (req, res, next) => {
    try {
        const village = await villageService.getVillageById(req.params.id);
        if (!village) return res.status(404).json({ message: 'Village not found' });
        res.json(village);
    } catch (err) {
        next(err);
    }
};

exports.getAllVillages = async (req, res, next) => {
    try {
        const result = await villageService.getAllVillages(req.query);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateVillage = async (req, res, next) => {
    try {
        const village = await villageService.updateVillage(req.params.id, req.body);
        res.json(village);
    } catch (err) {
        next(err);
    }
};

exports.deleteVillage = async (req, res, next) => {
    try {
        await villageService.deleteVillage(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
