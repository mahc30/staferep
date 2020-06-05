const express = require('express');
const router = express.Router();

const obra_controller = require('../controllers/obras_Controller');

/* GET obras listing. */
router.get('/findall', obra_controller.find_all);

/* GET obras by id. */
router.get('/findid', obra_controller.find_id);

/* Post Create new Obra */
router.post('/add', obra_controller.new_obra);

/* Delete Obra by id */
router.delete('/delete', obra_controller.delete_obra);

/* PATCH Obra by id */
router.patch('/update', obra_controller.patch_obra);

module.exports = router;
