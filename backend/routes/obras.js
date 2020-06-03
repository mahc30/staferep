const express = require('express');
const router = express.Router();

const obra_controller = require('../controllers/obrasController');

/* GET obras listing. */
router.get('/', obra_controller.all_obras);

/* GET obras by id. */
router.get('/:id', obra_controller.id_obra);

/* Post Obra */
router.post('/add', obra_controller.new_obra);

module.exports = router;
