const express = require('express');
const router = express.Router();
const familyController = require('../../controllers/familyController/familyController');

router.post('/create', familyController.createFamily);
router.get('/', familyController.getAllFamilies);
router.get('/:id', familyController.getFamilyById);
router.put('update/:id', familyController.updateFamily);
router.delete('/delete/:id', familyController.deleteFamily);
router.put('/bulk-update', familyController.updateManyFamilies); // Bulk update route

module.exports = router;
