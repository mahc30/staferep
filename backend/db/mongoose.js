const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('../util/logger');

//************************** Setup DB **************************
var route = path.join(__dirname, "..", "util", "secrets", "credentials");
var db = mongoose.connection;

fs.readFile(route, 'utf8', (err, data) => {
    if (err) {
        console.log("Couldn't Read Credentials", err);
        return;
    }

    data = parseCredentials(data);
    let username = data[0]
    let password = data[1];
    let database = data[2];

    let uri = `mongodb+srv://${username}:${password}@cluster0-jxu3e.gcp.mongodb.net/${database}?retryWrites=true&w=majority`;
    mongoose.set('debug', true);
    mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 5000
        }
    );

    db.on('error', err => {
        if (err) logger.new_Log("DBConnection", "mongoose", false);
    });

    db.once('open', () => {
        logger.new_Log("DBConnection", "mongoose", true);
    });
});

// Because i won't remember that's the regular expression just to type a \n
function parseCredentials(raw_credentials) {
    return raw_credentials.split(/\r?\n/);
}

module.exports = db;