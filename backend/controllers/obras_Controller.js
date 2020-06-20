const logger = require('../util/logger');
const Obra = require('../db/models/Obra');
const File = require('../db/models/File');
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const fs = require('fs');


/*
    INDEX:
Get Obras List
Get Obras by ID
Post new Obra
Delete Obra by ID


*/

/* GET obras listing. */
exports.find_all = async function (req, res) {

    try {
        const obra_list = await Obra.find();
        logger.new_Log(req.method, req.baseUrl, true);
        res.status(200).send(obra_list);
    }
    catch
    {
        logger.new_Log(req.method, req.baseUrl, false);
        res.status(500).send("F");
    }
};

/* GET obras by id. */
exports.find_id = async function (req, res) {
    try {
        const obra = await Obra.findById(req.params.obra_id);

        if (obra) {
            logger.new_Log(req.method, req.baseUrl, true);
            res.status(200).send(obra);
        }
        else
            res.sendStatus(204);
    }
    catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};

/* GET download */
exports.download = async function (req, res) {

    try {
        let obra = await Obra.findById(req.params.obra_id);

        if (obra && obra.file_exists) {
            let download_path = path.join(__dirname, "..", "repertorio", `${obra.name}.pdf`);
            res.status(200).download(download_path);
        }
        else res.sendStatus(204);
    }
    catch (err) {
        console.log("Download Error: ", err);
        res.sendStatus(500);
    }

};

// TODO Handle Get by Filters
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
        let save_obra = await newObra.save();
        logger.new_Log(req.method, req.baseUrl, true)
        res.status(200).send(save_obra);

    } catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};

/* DELETE obras by id. */
exports.delete_obra = async function (req, res) {
    console.log("Deleting", req.body);
    try {
        const obra = await Obra.findByIdAndDelete(req.body.obra_id);
        logger.new_Log(req.method, req.baseUrl, true);
        res.status(200).send(obra);

    } catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};

/* PATCH obra by id */
exports.patch_obra = async function (req, res) {
    let id = req.body.obra_id;
    delete req.body.obra_id;
    console.log("REQ . BODY", req.body);
    try {
        let new_obra = await Obra.findOneAndUpdate({ _id: id }, req.body);

        console.log("FUCK THE POLICE: ", new_obra);
        logger.new_Log(req.method, req.baseUrl, true)
        res.status(200).send(new_obra);

    } catch (err) {
        logger.new_Log(req.method, req.baseUrl, false);
        console.log(err);
        res.status(500).send(err);
    }
};

/* POST get by filters */
exports.find_all_filtered = async function (req, res) {
    let filters = req.body;
    try {
        const obra_list = await Obra.find(filters);
        await logger.new_Log(req.method, req.baseUrl, true);
        res.status(200).send(obra_list);
    }
    catch
    {
        await logger.new_Log(req.method, req.baseUrl, false);
        res.status(500).send("F");
    }
}

/* POST upload file */
exports.upload = async function (req, res) {
    /* This code executes when file has already been saved.
    As multer doesn't have much customization and stuff 
    and will save everything locally, it's necesary to add
    an external data storage so files can persist between containers */
    if (!req.file) { //This means multer had an error
        res.status(500).send("Error guardando archivo.Multer");
        return;
    }
    const file_path = req.file.path;
    const file_name = req.file.filename;
    const file = fs.readFileSync(file_path);
    const obra_id = req.params.obra_id;

    const mongo_file = new File({
        name: file_name,
        parent_id: ObjectId(obra_id),
        data: file,
        content_type: "document/pdf",
    })

    mongo_file.save()
    res.send(200);
}   