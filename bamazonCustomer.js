//Variables
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var productId
var quantity
var stock
var total

//DB connection

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId + "\n");
});

console.log("");
console.log("\n====================================================================\n");
console.log("                       WELCOME TO BAMAZON!");
console.log("\n====================================================================\n");
console.log("");
readProducts();

//Main menu

function mainMenu() {

  inquirer.prompt([

      {
        type: "list",
        message: "What do you want to do?",
        choices: ["Buy a product", "See our products list", "EXIT"],
        name: "toDo"
      }
    ])

    .then(function(inquirerResponse) {

      command = inquirerResponse.toDo

      switch (command) {
        case "Buy a product":
          buyProducts();
          break;
        case "See our products list":
          readProducts();
          break;
        case "EXIT":
          exit();
          break;
      } // Ends switch
    });
} //-----------END FUNCTION mainMenu


// Functions

function readProducts() {
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    mainMenu()

  });
} //end function readProducts

function buyProducts() {

  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    inquirer.prompt([

        {
          name: "ProductId",
          type: "list",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push({
                value: results[i].item_id + "",
                name: results[i].product_name
              });
            }
            return choiceArray;
          },
          message: "Select the product you want:"
        },

        {
          type: "list",
          message: "How many items do you want?:",
          choices: ["1", "2", "5", "10"],
          name: "quantity"
        }

      ])

      .then(function(inquirerResponse) {
        productId = inquirerResponse.ProductId
        quantity = inquirerResponse.quantity
        checkInventory();
      });
  });
} // Ends function buyProducts

function checkInventory() {
  var query = connection.query("SELECT * FROM products WHERE ?", {
    item_id: productId
  }, function(err, res) {
    if (err) throw err;

    stock = res[0].stock_quantity

    if (stock >= quantity) {

      stock = stock - quantity
      placeOrder()
    } else if (stock === 0) {
      console.log("\n====================================================================\n");
      console.log("   Unfortunately, we don't have "+ res[0].product_name + " in stock");
      console.log("      pleace try later.");
      console.log("\n====================================================================\n");
      mainMenu()
    } else{
      console.log("\n====================================================================\n");
      console.log("There is/are only " + stock + " " + res[0].product_name + " in stock");
      console.log("pleace adjuts quantity to " + stock + " or less");
      console.log("\n====================================================================\n");

      mainMenu()

    }
  });

} //Ends checkInventory function

function placeOrder() {
  var queryCost = connection.query("SELECT * FROM products WHERE ?", {
    item_id: productId
  }, function(err, res) {
    if (err) throw err;
    var subtotal = (res[0].price) * quantity
    total  = subtotal.toFixed(2)
    total2 = total
    console.log("\n====================================================================\n");
    console.log("                  Thank you for buy at BAMAZON");
    console.log("\n--------------------------------------------------------------------\n");
    console.log("            Product: " + res[0].product_name);
    console.log("           Quantity: " + quantity);
    console.log("          Unit cost: $" + (res[0].price));
    console.log("                    ________");
    console.log("              Total: $" + total);
    updateDB()
  })


} //Ends function placeOrder

function updateDB() {
  var queryStock = connection.query("UPDATE products SET ? WHERE ?",

    [{
        stock_quantity: stock,
        product_sales: total
      },
      {
        item_id: productId
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log("\n-------------------------------------------------------------------\n");
      console.log("                Your order has been submited\n");
      console.log("\n====================================================================\n");
      mainMenu()
    })
}


function exit() {
  console.log("");
  console.log("\n====================================================================\n");
  console.log("          Thank you for your preference! come back soon!!");
  console.log("\n====================================================================\n");
  console.log("");

  connection.end();
} //-----------END FUNCTION
