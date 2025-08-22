const prisma = require('../../db/prisma');
const villageService = require('../../services/villageService');
const { hashPassword } = require('../../utils/hash');
const MailService = require('../../services/emailService')
const mailService = new MailService();

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

    if (!chakola || !chakola.connect.id) {
        return res.status(400).json({ error: 'Valid choklaId is required' });
    }
    try {
        const hashedPassword = await hashPassword(password);

        // ✅ Run DB operations in transaction
        const result = await prisma.$transaction(async (tx) => {
            const chokla = await tx.chakola.findUnique({
                where: { id: chakola.connect.id },
            });

            if (!chokla) {
                throw new Error('Chokla with given ID not found');
            }

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

        // ✅ Only runs if DB transaction was successful
        await mailService.sendMail({
            to: email,
            subject: 'Welcome to the Panchal Samaj Portal - Village Registration!',
            text: `Hello ${name},\n\nYour village account has been successfully created on the Panchal Samaj Portal.\n\nYou can log in at: https://panchalsamaj14.shreetripurasundari.com/login\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure and do not share it with unauthorized users.`,
            html: `
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your <strong>village account</strong> has been successfully created on the Panchal Samaj Portal.</p>
                <p><strong>Login URL:</strong> <a href="https://panchalsamaj14.shreetripurasundari.com/login" target="_blank">Login</a></p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>Please keep this information secure and do not share it with unauthorized individuals.</p>
                <p>Thank you for being a part of the Panchal community!</p>
            `
        });

        res.status(201).json(result);
    } catch (err) {
        console.error("Error in createVillage:", err);
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
        res.status(200).json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
        });

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