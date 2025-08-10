const familyService = require('../../services/familyService');

exports.createFamily = async (req, res, next) => {
    try {
        const family = await familyService.createFamily(req.body);
        res.status(201).json({ success: true, data: family });
    } catch (err) {
        console.error("Error in createFamily controller:", err);
        next(err);
    }
};

exports.getFamilyById = async (req, res, next) => {
    try {
        const family = await familyService.getFamilyById(req.params.id);
        if (!family) return res.status(404).json({ message: 'Family not found' });
        res.json(family);
    } catch (err) {
        next(err);
    }
};

exports.getAllFamilies = async (req, res, next) => {
    try {
        const result = await familyService.getAllFamilies(req.query);
        res.json(result);
    } catch (err) {
        next(err);
    }
};


exports.updateFamily = async (req, res, next) => {
    console.log(req)
    try {
        const family = await familyService.updateFamily(req.params.id, req.body);
        res.json(family);
    } catch (err) {
        next(err);
    }
};

exports.deleteFamily = async (req, res, next) => {
    try {
        const deleted = await familyService.deleteFamily(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Family not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Family deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting family:", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the family",
            error: err.message
        });
    }
};


exports.updateManyFamilies = async (req, res, next) => {
    try {
        const { filter, data } = req.body;
        if (!filter || !data) {
            return res.status(400).json({ message: 'Both "filter" and "data" are required.' });
        }

        const result = await familyService.updateManyFamilies(filter, data);
        res.json({ updatedCount: result.count });
    } catch (err) {
        next(err);
    }
};
