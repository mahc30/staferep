const logger = require('../util/logger');
const Auth = require('../db/models/Auth');
const jwt = require('../jwt/jwt');

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/* POST register */
exports.register = async function(req, res) {

    let encrypted_pw = encrypt(req.body.password);
    let auth = new Auth({ password: encrypted_pw });
    //TODO FInish register 
    try {
        const obra_list = await auth.save();
        logger.new_Log(req.method, req.baseUrl, true)
        res.status(200).send(obra_list);
    } catch {
        await logger.new_Log(req.method, req.baseUrl, false);
        res.status(500).send("F");
    }
};

/* POST login */
exports.login = async function(req, res) {
    let encrypted_pw = encrypt(req.body.password);

    try {
        const result = await Auth.findOne({ password: encrypted_pw });
        let token = await jwt.sign_token({ "user": "generic user" }) //TODO users
        let auth_info = {
            level: "1",
            token: token
        }
        logger.new_Log(req.method, req.baseUrl, true);

        if (result) res.status(202).send(auth_info);
        else res.sendStatus(401);
    } catch {
        logger.new_Log(req.method, req.baseUrl, false);
        res.status(500).send("F");
    }
};

let algorithm = 'aes-256-ctr';
let password = fs.readFileSync(path.join(__dirname, "..", "util", "secrets", "public.key"), { encoding: 'utf-8' });

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

// TODO not necessary but could be useful later
function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}