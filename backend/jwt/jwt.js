const jwt = require("jsonwebtoken");
const fs = require('fs');

var privateKey = fs.readFileSync("./util/secrets/private.key", 'utf8');
var publicKey = fs.readFileSync("./util/secrets/public.key", "utf8");

//JWT options 
var signOptions = {
    issuer: "daHinkpie",
    subject: "daHinkpie@gmail.com",
    audience: "http://www.daHinkpie.tk",
    expiresIn: "24h",
    algorithm: "RS256"
}

var verifyOptions = {
    issuer: "daHinkpie",
    subject: "daHinkpie@gmail.com",
    audience: "http://www.daHinkpie.tk",
    maxAge: "24h",
    algorithms: ["RS256"]
}


async function sign_token(payload) {
    return new Promise(async(resolve, reject) => {
        try {

            await jwt.sign(payload, privateKey, signOptions, function(err, token) {
                if (err) reject("Failed Creating new Token");
                resolve(token);
            });
        } catch (error) {
            reject(error);
        }

    });
}

//Verify Token Middleware
async function verify_token(req, res, next) {
    let token = req.headers['access-token'];
    if (!token) {
        res.sendStatus(300);
        return;
    }

    try {
        jwt.verify(token, publicKey, verifyOptions, (err, decoded) => {
            if (err) {
                res.status(300).json({ error: 'Invalid Token' })
                return;
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } catch (error) {
        res.status(300).send({ error: 'Error verifying Token' })
    }

}

exports.sign_token = sign_token;
exports.verify_token = verify_token;
//Verify
//  var verified = jwt.verify(token, publicKey, verifyOptions);
//console.log("Verified: ", JSON.stringify(verified));

//Decode
//  var decoded = jwt.decode(token, { complete: true });
//console.log("Decoded Header: ", JSON.stringify(decoded.header));
//console.log("Decoded Payload: ", JSON.stringify(decoded.payload));