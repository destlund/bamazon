var mysql = require('mysql');
var inquirer = require('inquirer');

// setting the variables for our connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: 'bamazon'
});

// let's get connected
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
    // wait until we're connected to start shopping
    shopNow();
});

var shopNow = function () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: "What is the ID of the items you wish to purchase?"
        },
        {
            type: 'input',
            name: 'number',
            message: "How many would you like?",
            default: function () {
                return 1;
            }
        }
    ]).then(function (answers) {
        // this is where we hit the database for stuff
        // let's find our item
        connection.query('SELECT * FROM products WHERE  item_id = ?', answers.item_id, function (error, results, fields) {
            if (error) console.log('You broke it! ' + error);

            // let's turn that raw SQL result into something readable
            var string = JSON.stringify(results);
            var itemObject = JSON.parse(string);

            // check whether it's a valid item
            if (itemObject[0] == undefined) {
                console.log("That product does not exist!");
                shopAgain();
                return;
            };

            // now let's check to see if there are enough of the item to fill the order
            if (results[0].stock_quantity < answers.number) {
                console.log("There are not " + answers.number + " " + itemObject[0].product_name + "s in stock right now. Check back later.")
                shopAgain();
                return;
            };

            // this is the SQL query we want to run to remove the items and (obviously) ship them
            var placeOrderSQL = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?'
            connection.query(placeOrderSQL, [parseInt(answers.number), parseInt(answers.item_id)], function(err, result) {
                if (err) {
                    console.log('CRITICAL FAILURE! ABORT! ABORT! ' + err);
                    return;
                };
                console.log("Success! They're on their way.\nThere are " + (results[0].stock_quantity - answers.number) + " " + results[0].product_name + "s remaining in stock.");
                console.log("We have just deducted $" + (answers.number * itemObject[0].price) + ' from your account with our magical handwaving device.');
                shopAgain();
                return;
            });
            return;
        });
    });
};

// prompt the user to see if they're finished
var shopAgain = function () {
    inquirer.prompt({
        type: 'confirm',
        name: 'shopAgain',
        message: "Would you like to make another purchase?",
        default: false
    }).then(function (response) {
        if (response.shopAgain === false) {
            console.log('Your products are on their way! Goodbye.');
            connection.end();
            return;
        }
        shopNow(response);
    })
}