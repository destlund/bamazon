var mysql = require('mysql');
var inquirer = require('inquirer');
// var fs = require('fs');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);

    // fs.readFile(__dirname + "/make-bamazon.sql", "ascii", function(err, data) {
    //     if (err) throw err;
    //     console.log(data);
    //     connection.query(data, function(err, res, fields) {
    //         if (err) throw err;
    //         console.log(res);
    //         console.log('Bamazon Database Initialized')
    //     });
    // });
//     // connection.query(fs.readSync(__dirname + "/make-bamazon.sql"), function (error, results, fields) {
//         // if (error) throw error;
//         console.log('Bamazon Database Initialized');
//     // });
});
