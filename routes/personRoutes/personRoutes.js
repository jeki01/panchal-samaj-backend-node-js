const express = require('express');
const router = express.Router();
const personController = require('../../controllers/personController/personController');

router.post('/create', personController.createPerson);
router.get('/', personController.getAllPersons);
router.get('/:id', personController.getPersonById);
router.put('/update/:id', personController.updatePerson);
router.delete('/:id', personController.deletePerson);
router.put('/bulk-update', personController.updateManyPersons);


module.exports = router;
