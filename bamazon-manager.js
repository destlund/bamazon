var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("json-to-table");
// var fs = require("fs");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: 'bamazon'
});
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    manage();


});

var manage = function () {
    inquirer.prompt({
        type: "rawlist",
        name: "doThis",
        message: "Please choose a manager function:",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function (choice) {
        switch (choice.doThis) {
            case "View Products for Sale":
                viewAll();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                orderMore();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
                console.log("Dunno how you did that.");
                break;
        };
    });
};

var keepManaging = function () {
    inquirer.prompt({
        type: "confirm",
        name: "manageAgain",
        message: "Would you like to keep on managing?",
        default: false
    }).then(function (response) {
        if (response.manageAgain === false) {
            console.log("Good manager! Now go drown your sorrows! Goodbye.");
            connection.end();
            return;
        }
        manage();
    })
}

var viewAll = function () {
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) console.log('You broke it! ' + error);
        makeTable(results);
        keepManaging();
    });
}

var viewLow = function () {
    connection.query('SELECT * FROM products ORDER BY stock_quantity ASC LIMIT 5', function (error, results, fields) {
        if (error) console.log('You broke it! ' + error);
        makeTable(results);
        keepManaging();
    });
}

var orderMore = function () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: "What is the ID of the item you wish to order?"
        },
        {
            type: 'input',
            name: 'number',
            message: "How many do we need?",
            default: function () {
                return 1;
            }
        }
    ]).then(function (answers) {
        connection.query('SELECT * FROM products WHERE  item_id = ?', answers.item_id, function (error, results, fields) {
            if (error) console.log('You broke it! ' + error);

            // let's turn that raw SQL result into something readable
            var string = JSON.stringify(results);
            var itemObject = JSON.parse(string);

            // check whether it's a valid item
            if (itemObject[0] == undefined) {
                console.log("We don't carry that product!");
                keepManaging();
                return;
            };

            // this is the SQL query we want to run to order the items
            var placeOrderSQL = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?'
            connection.query(placeOrderSQL, [parseInt(answers.number), parseInt(answers.item_id)], function (err, result) {
                if (err) {
                    console.log('CRITICAL FAILURE! ABORT! ABORT! ' + err);
                    return;
                };
                console.log("Success! They're on their way.\nThere will be " + (results[0].stock_quantity + answers.number) + " " + results[0].product_name + "s when they arrive.");
                keepManaging();
                return;
            });
            return;
        });
    });
};

var addProduct = function () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: "What is the name of the new product?"
        },
        {
            type: 'rawlist',
            name: 'department',
            message: "What department carries this product?",
            choices: ['Prepared Foods', 'Dairy', 'Grocery', 'People', 'Produce', 'Specialty'],
            default: 'People'
        },
        {
            type: 'input',
            name: 'price',
            message: "What is the price of the new product?"
        },
        {
            type: 'input',
            name: 'initialOrder',
            message: "How many should we order to begin?"
        },
    ]).then(function (answers) {
        connection.query('INSERT INTO products (product_name, department, price, stock_quantity) VALUES (?,?,?,?)', [answers.product_name, answers.department, answers.price, answers.initialOrder], function (error, results, fields) {
            if (error) console.log('You broke it! ' + error);
            console.log("Success! They're on their way.\nThere will be " + answers.initialOrder + " " + answers.product_name + "s on the shelf in the " + answers.department + " department /almost/ immediately.");
            keepManaging();
            return;
        });
        return;
    });
};

var makeTable = function (results) {
    // let's turn that raw SQL result into something readable
    var string = JSON.stringify(results);
    var itemObject = JSON.parse(string);
    // json-to-table gives an almost-okay table...
    var prettyTable = table(itemObject);
    console.log(prettyTable);
}