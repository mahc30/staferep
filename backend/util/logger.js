const fs = require('fs');
const path = require('path');
const { promisify } = require('util')

const appendFileAsnyc = promisify(fs.appendFile);
const LOG_PATH = path.join(__dirname, '..', 'util', 'secrets', 'logs');

async function newLog(log) {

    let log_message = formatLog(log);
    appendFileAsnyc(LOG_PATH, log_message)
        .then(res => {
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        })

}

function formatLog(log) {

    let log_message = `${log.method} ${log.handler} at:  ${Date(Date.now())}`;
    log.status ? log_message = log_message.concat(" SUCCESS ") : log_message = log_message.concat(" ERROR ");
    if (log.message) log_message = log_message.concat(log.message);
    log_message = log_message.concat('\n'); //Add newline so append doesn't make a super wide line

    return log_message;
}

function setLog(method, handler, status, message) {
    var log = {
        method: method,
        handler: handler,
        status: status,
        message: message
    }

    return log;
}

module.exports.setLog = setLog;
module.exports.newLog = newLog;