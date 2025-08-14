const personService = require('../../services/personService');
const { Prisma } = require('@prisma/client');
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