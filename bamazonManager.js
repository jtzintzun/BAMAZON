//Variables
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var productId
var quantity
var stock

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
  mainMenu();
});
console.log("");
console.log("\n=================================================\n");
console.log("                 WELCOMETO BAMAZON!");
console.log("");
console.log("                  [Manager Module]");
console.log("\n=================================================\n");
console.log("");

//Main menu

function mainMenu() {

  inquirer.prompt([

      {
        type: "list",
        message: "What do you want to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"],
        name: "toDo"
      }
    ])

    .then(function(inquirerResponse) {

      command = inquirerResponse.toDo

      switch (command) {
        case "View Products for Sale":
          readProducts();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          newProduct();
          break;

        case "EXIT":
          console.log("exit");

          exit();
          break;
      } // Ends switch
    });
} //-----------END FUNCTION mainMenu


// // Functions

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    mainMenu()

  });
} //end function readProducts

function lowInventory() {
  console.log("\n=======================================\n");
  console.log("       LOW INVENTORY LEVELS");
  console.log("\n---------------------------------------\n");
  console.log("");

  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    for (var i = 0; i < results.length; i++) {
      if (results[i].stock_quantity < 5) {
        console.log("-> "  + results[i].product_name + " " + results[i].stock_quantity + " units ");
      }
    }
    console.log("");
    console.log("\n=======================================\n");
    mainMenu()
  });
} // Ends function buyProducts

function addInventory() {

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
          message: "Select the product you want to add inventory:"
        },
        {
          type: "input",
          message: "how many items do you want to add:",
          name: "quantity"
        }

      ])

      .then(function(inquirerResponse) {
        productId = inquirerResponse.ProductId
        quantity = parseInt(inquirerResponse.quantity, 10)
        checkInventory();
      });
  });
} // Ends function buyProducts

function checkInventory() {
  console.log("\n=================================================\n");
  console.log("Product ID: " + productId);
  console.log("");
  console.log("Quantity added to the inventory: " + quantity);
  var query = connection.query("SELECT * FROM products WHERE ?", {
    item_id: productId
  }, function(err, res) {
    if (err) throw err;

    stock = res[0].stock_quantity
    stock = stock + quantity;

    console.log("\n=================================================\n");
    console.log("Now you have " + stock + " " + res[0].product_name + " in stock");
    console.log("\n=================================================\n");

    updateStock()
  })
} //Ends checkInventory function

function updateStock() {

  var queryStock = connection.query("UPDATE products SET ? WHERE ?",

    [{
        stock_quantity: stock
      },
      {
        item_id: productId
      }
    ],

    function(err, res) {
      if (err) throw err;
      mainMenu()
    })

} //Ends function updateStock

function newProduct() {


  inquirer.prompt([

      {
        type: "input",
        message: "What is the name of the item do you want to add? ",
        name: "product_name"
      },
      {
        type: "input",
        message: "What is the department of this item? ",
        name: "department_name"
      },

      {
        type: "input",
        message: "how many items do you want to add?",
        name: "stock_quantity"
      },
      {
        type: "input",
        message: "What is the cost per unit of the item?",
        name: "price"
      }

    ])
    .then(function(answer) {
      var query = connection.query("INSERT INTO products SET ?",

          {
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock_quantity: answer.stock_quantity
          },
        function(err, res) {
          if (err) throw err;
          mainMenu()
        })

    });
}


function exit() {
  console.log("");
  console.log("\n=================================================\n");
  console.log("                   See you soon!!");
  console.log("\n=================================================\n");
  console.log("");
  connection.end();
} //-----------END FUNCTION
