const logger = require('../util/logger');
const Obra = require('../db/models/Obra');
const db = require('../db/mongoose');

var log;

/* GET obras listing. */
exports.find_all = async function (req, res) {

    try {
        const obra_list = await Obra.find();
        await logger.new_Log(req.method, req.baseUrl, true);
        res.status(200).send(obra_list);
    }
    catch
    {
        await logger.new_Log(req.method, req.baseUrl, false);
        res.status(500).send("F");
    }
};

/* GET obras by id. */
exports.find_id = async function (req, res) {
    try {
        const obra = await Obra.findById(req.body.obra_id);

        if (obra) {
            logger.new_Log(req.method, req.baseUrl, true);
            res.status(200).send(obra);
        }

        res.sendStatus(204);

    }
    catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};

/* Post Obra */
exports.new_obra = async function (req, res) {
    //TODO handle possible pdf submit
    let file_exists = req.body.file_exists;

    let newObra = new Obra(
        {
            name: req.body.obra_name,
            composer: req.body.obra_composer,
            level: req.body.obra_level,
            file_exists: file_exists || false
        });

    try {
        let save_status = await newObra.save();
        logger.new_Log(req.method, req.baseUrl, true)

        res.status(200).send("Obra Guardada :)");

    } catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};

/* DELETE obras by id. */
exports.delete_obra = async function (req, res) {
    try {
        const obra = await Obra.findByIdAndDelete(req.body.obra_id);
        logger.new_Log(req.method, req.baseUrl, true)
        res.status(200).send(obra);

    } catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};

/* PATCH obra by id */
exports.patch_obra = async function (req, res) {
    console.log(req.body);
    try {
        await Obra.update({ _id: req.body.obra_id },
            {
                name: req.body.obra_name,
                composer: req.body.obra_composer,
                level: req.body.obra_level
            })

        logger.new_Log(req.method, req.baseUrl, true)
        res.sendStatus(200);

    } catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};