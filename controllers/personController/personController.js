const personService = require('../../services/personService');
const { Prisma } = require('@prisma/client');
const MailService = require('../../services/emailService'); // Adjust the path as necessary
const mailService = new MailService();

exports.createPerson = async (req, res, next) => {
    try {
        // Validate and convert dateOfBirth to ISO string if present
        if (req.body.dateOfBirth) {
            const dob = new Date(req.body.dateOfBirth);
            if (isNaN(dob.getTime())) {
                return res.status(400).json({ message: 'Invalid dateOfBirth format. Expected ISO-8601 DateTime.' });
            }
            req.body.dateOfBirth = dob.toISOString();
        }
        const person = await personService.createPerson(req.body);
        if (req.body.email) {
            try {
                await mailService.sendMail({
                    to: req.body.email,
                    subject: 'Welcome to Panchal Samaj App!',
                    text: `Dear ${req.body.firstName || 'Member'},\n\nWelcome to the Panchal Samaj App! Your ID is: ${person._id}\n\nThank you for joining us!`,
                    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h2 style="color: #4CAF50; margin: 0;">Panchal Samaj App</h2>
            <p style="color: #777; font-size: 14px;">Connecting the Community</p>
        </div>

        <div style="background-color: #fff; padding: 20px; border-radius: 6px;">
            <p style="font-size: 16px;">Dear <strong>${req.body.firstName || 'Member'}</strong>,</p>
            
            <p style="font-size: 15px; line-height: 1.6;">
                Welcome to the <strong>Panchal Samaj App</strong>! We're excited to have you join our community.
            </p>

            <p style="font-size: 15px; line-height: 1.6;">
                <strong style="color: #4CAF50;">Your Member ID:</strong><br>
                <span style="font-size: 18px; color: #333;">${person.id}</span>
            </p>

            <p style="font-size: 15px; line-height: 1.6;">
                You can now connect with fellow members, access events, and stay informed with community updates.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://panchalsamaj14.shreetripurasundari.com" style="background-color: #4CAF50; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                    Visit Panchal Samaj App
                </a>
            </div>

            <p style="font-size: 14px; color: #888;">
                If you have any questions, feel free to reply to this email.
            </p>
        </div>

        <div style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} Panchal Samaj. All rights reserved.
        </div>
    </div>
    `,
                });

            } catch (emailErr) {
                console.error("⚠️ Failed to send welcome email:", emailErr.message);
                // Don't fail the whole request just because of email issue
            }
        }

        res.status(201).json(person);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message, errors: err.errors });
        }
        next(err);
    }
};

exports.getPersonById = async (req, res, next) => {
    try {
        const person = await personService.getPersonById(req.params.id);
        if (!person) return res.status(404).json({ message: 'Person not found' });
        res.json(person);
    } catch (err) {
        next(err);
    }
};

exports.getAllPersons = async (req, res, next) => {
    try {
        const people = await personService.getAllPersons();
        res.json(people);
    } catch (err) {
        next(err);
    }
};



exports.updatePerson = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Missing person ID' });
        }

        // ✅ Validate and normalize dateOfBirth
        if (data.dateOfBirth) {
            const dob = new Date(data.dateOfBirth);
            if (isNaN(dob.getTime())) {
                return res.status(400).json({
                    message: 'Invalid dateOfBirth format. Expected ISO-8601 DateTime.',
                });
            }
            data.dateOfBirth = dob.toISOString();
        }

        const person = await personService.updatePerson(id, data);

        res.status(200).json(person);
    } catch (err) {
        // ✅ Prisma-specific errors
        if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ message: 'Validation error', error: err.message });
        }

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({ message: 'Database error', error: err.message });
        }

        // ✅ Catch-all for unexpected errors
        console.error('Unexpected error in updatePerson:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deletePerson = async (req, res, next) => {
    try {
        const deleted = await personService.deletePerson(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (err) {
        // Handle Prisma "record not found" error
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Person not found. The record may have already been deleted.' });
        }
        res.status(500).json({ message: err.message || 'An error occurred while deleting the person.' });
    }
};

exports.updateManyPersons = async (req, res, next) => {
    try {
        const { filter, data } = req.body;

        if (!filter || !data) {
            return res.status(400).json({ message: 'Both "filter" and "data" fields are required.' });
        }
        const result = await personService.updateManyPersons(filter, data);
        res.json({ updatedCount: result.count });
    } catch (err) {
        next(err);
    }
};