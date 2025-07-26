const express = require('express');
const router = express.Router();
const chakolaController = require('../../controllers/chakolaController/chakolaController');

// GET /api/chakolas
router.get('/', chakolaController.getAllChakolas);
router.post('/create', chakolaController.creteChokhla);
router.get('/:id', chakolaController.getChokhlaById);
router.put('/edit/:id', chakolaController.editChokhla);
router.get('/getvillage/:chokhlaid', chakolaController.getVillageWithChokhlaId);

module.exports = router;
