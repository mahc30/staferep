const express = require('express');
const router = express.Router();

//File Handler Middleware configuration TODO move this to an independent module or something
const multer = require('multer');
const path = require('path');
//Web Token Verification Middleware
const jwt = require('../jwt/jwt');

const upload_path = path.join(__dirname, "..", "repertorio");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, upload_path)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage });

const obra_controller = require('../controllers/obras_Controller');

/* GET obras listing. */
router.get('/findall', obra_controller.find_all);

/* GET obras by id. */
router.get('/findid/:obra_id', obra_controller.find_id);

/* post downloadObra. */
router.get('/download/:obra_id', obra_controller.download);

/* Post Create new Obra */
router.post('/add', jwt.verify_token, obra_controller.new_obra);

/* Post find obras by Filters */
router.post('/findFilter', obra_controller.find_all_filtered);

/* Post find obras by Filters */
router.post('/upload/:obra_id', jwt.verify_token, upload.single('file'), obra_controller.upload);

/* Delete Obra by id */
router.delete('/delete', jwt.verify_token, obra_controller.delete_obra);

/* PATCH Obra by id */
router.patch('/update/', jwt.verify_token, obra_controller.patch_obra);

module.exports = router;