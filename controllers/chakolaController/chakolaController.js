const prisma = require('../../db/prisma');
const chakolaService = require('../../services/chakolaService');
const villageService = require('../../services/villageService');
const { hashPassword } = require('../../utils/hash');
const MailService = require('../../services/emailService')
const mailService = new MailService(process.env.GMAIL_USER, process.env.GMAIL_PASS);
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

        // ✅ Wrap DB operations inside a transaction
        const result = await prisma.$transaction(async (tx) => {
            // ✅ Optional: Check for existing user with same email to avoid unique constraint error
            const existingUser = await tx.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                throw new Error('User with this email already exists.');
            }

            // ✅ Create chokhla
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

            // ✅ Create user
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

        // ✅ Send email only if transaction succeeds
        await mailService.sendMail({
            to: email,
            subject: 'Welcome to the Panchal Samaj Portal!',
            text: `Hello ${name},\n\nYour account has been successfully created.\n\nYou can log in at: https://panchalsamaj14.shreetripurasundari.com/login\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.`,
            html: `
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your account has been successfully created.</p>
                <p><strong>Login URL:</strong> <a href="https://panchalsamaj14.shreetripurasundari.com/login" target="_blank">Login</a></p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>Please keep this information secure.</p>
            `
        });

        res.status(201).json(result);
    } catch (err) {
        console.error('Error in creteChokhla:', err.message || err);
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


