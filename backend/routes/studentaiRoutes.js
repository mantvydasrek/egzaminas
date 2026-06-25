const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentaiController');

router.get('/', controller.gautiVisus);
router.get('/:id', controller.gautiPagalId);
router.post('/', controller.sukurti);
router.put('/:id', controller.atnaujinti);
router.delete('/:id', controller.istrinti);

module.exports = router;
