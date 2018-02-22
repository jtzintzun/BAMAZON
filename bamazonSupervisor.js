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
console.log("                 [Supervisor Module]");
console.log("\n=================================================\n");
console.log("");

//Main menu

function mainMenu() {

  inquirer.prompt([

      {
        type: "list",
        message: "What do you want to do?",
        choices: ["View Product Sales by Department", "View Product Sales by Department2","View Product Sales by Department3", "Create New Department", "EXIT"],
        name: "toDo"
      }
    ])

    .then(function(inquirerResponse) {

      command = inquirerResponse.toDo

      switch (command) {
        case "View Product Sales by Department":
          readProducts();
          break;

        case "View Product Sales by Department2":
          readProducts2();
          break;

          case "View Product Sales by Department3":
            readProducts3();
            break;

          case "Create New Department":
            newDepartment();
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
  connection.query("SELECT department_name, sum(over_head_costs) AS over_head_costs FROM departments GROUP BY department_name", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    mainMenu()

  });
} //end function readProducts


function readProducts2() {
  connection.query("SELECT department_name, sum(product_sales) AS product_sales FROM products GROUP BY department_name", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    mainMenu()

  });
} //end function readProducts

function readProducts3() {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, (departments.over_head_costs - products.product_sales) AS total_profit FROM departments JOIN products ON departments.department_name = products.department_name"
, function(err, res) {
    
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    mainMenu()

  });
} //end function readProducts


function newDepartment() {


  inquirer.prompt([

      {
        type: "input",
        message: "What is the name of the new department do you want to add? ",
        name: "department_name"
      },
      {
        type: "input",
        message: "What is de over head costs?",
        name: "over_head_costs"
      }

    ])
    .then(function(answer) {
      var query = connection.query("INSERT INTO departments SET ?",

          {
            department_name: answer.department_name,
            over_head_costs: answer.over_head_costs,
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
