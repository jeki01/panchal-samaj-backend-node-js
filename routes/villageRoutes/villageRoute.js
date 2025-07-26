const express = require('express');
const router = express.Router();
const villageController = require('../../controllers/villageController/villageController');

router.post('/create', villageController.createVillage);
router.get('/', villageController.getAllVillages);
router.get('/:id', villageController.getVillageById);
router.put('/:id', villageController.updateVillage);
router.delete('/:id', villageController.deleteVillage);

module.exports = router;
