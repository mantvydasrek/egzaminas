const express = require('express');
const router = express.Router();
const controller = require('../controllers/dalykaiController');

router.get('/studentas/:studentoId', controller.gautiStudentoDalykus);
router.post('/studentas/:studentoId', controller.pridetiDalyka);
router.put('/:id', controller.atnaujintiDalyka);
router.delete('/:id', controller.istrintiDalyka);

module.exports = router;
