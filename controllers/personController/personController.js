const personService = require('../../services/personService');

exports.createPerson = async (req, res, next) => {
    try {
        const person = await personService.createPerson(req.body);
        res.status(201).json(person);
    } catch (err) {
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
        const person = await personService.updatePerson(req.params.id, req.body);
        res.json(person);
    } catch (err) {
        next(err);
    }
};

exports.deletePerson = async (req, res, next) => {
    try {
        await personService.deletePerson(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
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
