const familyService = require('../../services/familyService');
const prisma = require('../../db/prisma');

// Create a family (Express route handler)
exports.createFamily = async (req, res, next) => {
    try {
        const data = req.body;

        // Validate required fields
        if (!data?.mukhiyaName) {
            return res.status(400).json({
                success: false,
                error: { message: '`mukhiyaName` is required.' }
            });
        }
        if (!data?.villageId) {
            return res.status(400).json({
                success: false,
                error: { message: '`villageId` is required.' }
            });
        }
        if (!data?.chakolaId) {
            return res.status(400).json({
                success: false,
                error: { message: '`chakolaId` is required.' }
            });
        }

        // Create the family using only fields from the Prisma schema
        const family = await prisma.family.create({
            data: {
                mukhiyaName: data.mukhiyaName,
                status: data.status,
                economicStatus: data.economicStatus,
                villageId: data.villageId,
                chakolaId: data.chakolaId,
                createdDate: data.createdDate ? new Date(data.createdDate) : undefined,
                updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
                longitude: data.longitude ?? null,
                latitude: data.latitude ?? null,
                anyComment: data.anyComment || null,
                permanentFamilyDistrict: data.permanentFamilyDistrict || null,
                permanentFamilyState: data.permanentFamilyState || null,
                permanentFamilyPincode: data.permanentFamilyPincode || null,
                permanentAddress: data.permanentAddress || null,
                permanentFamilyVillage: data.permanentFamilyVillage || null,
                currentFamilyDistrict: data.currentFamilyDistrict || null,
                currentFamilyState: data.currentFamilyState || null,
                currentFamilyPincode: data.currentFamilyPincode || null,
                currentAddress: data.currentAddress || null,
                currentFamilyVillage: data.currentFamilyVillage || null,
            },
        });
        return res.status(201).json({
            success: true,
            data: family,
        });
    } catch (error) {
        console.error('❌ Error in createFamily:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create family.',
                details: error.message || error.toString(),
            },
        });
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