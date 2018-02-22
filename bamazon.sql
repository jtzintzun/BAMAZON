DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
  item_id  INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2),
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("Macbook", "Electronics", 2100, 25, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("Echo dot", "Electronics", 45, 15, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("Milk", "Food", 4.75, 100, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("Bananas", "Food", 3.7, 75, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("Pants", "Clothing", 102, 25, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("socks", "Clothing ", 10, 250, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("DCR camera", "Photography", 100, 25, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("18-140mm f/3.5-5.6G", "Photography", 100, 25, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("BCD", "Sports", 450, 15, 0);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("Fins", "Sports", 140, 20, 0);

CREATE TABLE departments(
  department_id  INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL(10,2),
  PRIMARY KEY (department_id)
);


INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 60000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Food", 40000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Clothing", 15000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Photography", 25000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Sports", 20000);


SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, (departments.over_head_costs - products.product_sales) AS total_profit
FROM departments
JOIN products
ON departments.department_name = products.department_name


SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, (SUM(departments.over_head_costs) - SUM(products.product_sales)) AS total_profit
FROM departments
JOIN products
ON departments.department_name = products.department_name
GROUP BY departments.department_name;



