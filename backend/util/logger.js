const fs = require('fs');
const path = require('path');
const { promisify } = require('util')

const appendFileAsnyc = promisify(fs.appendFile);
const LOG_PATH = path.join(__dirname, '..', 'util', 'secrets', 'logs');

function new_Log(method, handler, status, message) {
    var log = {
        method: method,
        handler: handler,
        status: status,
        message: message
    }

    let log_message = format_Log(log);

    create_Log(log_message);
}

function format_Log(log) {

    let log_message = `${log.method} ${log.handler} at:  ${Date(Date.now())}`;
    log.status ? log_message = log_message.concat(" SUCCESS ") : log_message = log_message.concat(" ERROR ");
    if (log.message) log_message = log_message.concat(log.message);
    log_message = log_message.concat('\n'); //Add newline so append doesn't make a super wide line

    return log_message;
}

function create_Log(log_message) {
    try {
        fs.appendFileSync(LOG_PATH, log_message, { encoding: 'utf-8' });
        console.log("log created");
        return;
    }
    catch{
        console.error("LOGERROR");
        throw new ErrorEvent("logerror");
    }
}

module.exports.new_Log = new_Log;