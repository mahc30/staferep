const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

//************************** Setup DB **************************
var route = path.join(__dirname,"..", "util", "secrets", "credentials");
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

    let url = `mongodb+srv://${username}:${password}@cluster0-jxu3e.gcp.mongodb.net/${database}?retryWrites=true&w=majority`;
    
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conectando a mongo...");
    
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log("we're connected!");
    });
});

function parseCredentials(raw_credentials){
    return raw_credentials.split(/\r?\n/);
}

module.exports = db;