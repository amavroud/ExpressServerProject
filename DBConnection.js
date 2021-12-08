const mysql = require('mysql');
function newConnection(){
    let conn = mysql.createConnection({
        host:'104.198.254.59',
        user: 'root',
        password: 'mypassword',
        database:'userDB'
    });
    return conn;
}
module.exports = newConnection;