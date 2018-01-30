DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id TINYINT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department VARCHAR(50) NULL,
  price FLOAT(7,2) NULL,
  stock_quantity TINYINT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Pasteurized Processed Cheese Food Product","Grocery",3.99,25),
("Shelbyville Lemons (6)","Produce",.99,50),
("Tampopo Ramen","Prepared Foods",13.99,20),
("String Cheese Incident","Dairy",.99,24),
("Duff Beer","Specialty",11.99,12),
("Sideways Merlot","Specialty",18.99,12),
("Cloudy with a chance of Meatballs","Prepared Foods",5.99,12),
("Soylent Green","People",4.99,30),
("Blue Milk","Dairy",3.49,24),
("Colonel Mustard","Grocery",2.99,12),
("Tan Red Apples","Produce",99,128);