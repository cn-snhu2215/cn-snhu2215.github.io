const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

// Establish connection to the sqlite database
async function openDBConnection() {
    return open({
        filename: path.join(__dirname, '../../database.db'),
        driver: sqlite3.Database
    });
}

module.exports = openDBConnection;