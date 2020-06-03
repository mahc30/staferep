const logger = require('../util/logger');
const Obra = require('../db/models/Obra');
const db = require('../db/mongoose');

var log;

/* GET obras listing. */
exports.all_obras = async function (req, res) {

    try {
        let obras = await Obra.find();
        log = await logger.setLog(req.method, req.baseUrl, true);
        res.status(200).send(obras);
    } catch (error) {
        log = await logger.setLog(req.method, req.baseUrl, false);
        res.status(404).send("Error");
    } finally {
        logger.newLog(log);
    }
};

/* GET obras by id. */
exports.id_obra = async function (req, res) {
    log = await logger.setLog(req.method, req.baseUrl, true);
    logger.newLog(log);
    res.send('NOT IMPLEMENTED - Get Parte x ID');
};

/* Post Obra */
exports.new_obra = async function (req, res) {
    let newObra = new Obra({});

    try {
        let save_status = await newObra.save();

        log = await logger.setLog(req.method, req.baseUrl, true);

        res.status(200).send("Obra Guardada :)");

    } catch (err) {
        log = await logger.setLog(req.method, req.baseUrl, false);
        res.status(500).send(err);
    } finally {
        logger.newLog(log);
    }
};