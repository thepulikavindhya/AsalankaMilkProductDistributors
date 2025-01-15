-- Create a database (if you don't already have one)
CREATE DATABASE IF NOT EXISTS inventory_system;

USE inventory_system;

-- Table for general return information
CREATE TABLE IF NOT EXISTS returns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_type ENUM('customer', 'company') NOT NULL,
    invoice_no VARCHAR(50),
    bill_date DATE,
    return_date DATE,
    deliveryman_id VARCHAR(50),
    customer VARCHAR(100),
    reason TEXT,
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for customer return items
CREATE TABLE IF NOT EXISTS customer_return_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_id INT,
    product VARCHAR(100) NOT NULL,
    qty INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE
);

-- Table for company return items
CREATE TABLE IF NOT EXISTS company_return_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_id INT,
    product VARCHAR(100) NOT NULL,
    qty INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE
);

-- Table for general invoice information
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50),
    bill_date DATE,
    deliveryman_id VARCHAR(50),
    customer VARCHAR(100),
    payment_method ENUM('cash', 'credit', 'cheque') NOT NULL,
    total_amount DECIMAL(10, 2),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for cash invoice items
CREATE TABLE IF NOT EXISTS cash_invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    product VARCHAR(100) NOT NULL,
    qty INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Table for credit invoice items
CREATE TABLE IF NOT EXISTS credit_invoice_items (
   id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    product VARCHAR(100) NOT NULL,
    qty INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Table for cheque invoice items
CREATE TABLE IF NOT EXISTS cheque_invoice_items (
     id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    product VARCHAR(100) NOT NULL,
    qty INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
-- Table for Invoice List

CREATE TABLE IF NOT EXISTS invoice_list(
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50),
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for payment information
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50),
     amount_paid DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deliver_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(100),
    credit_limit DECIMAL(10, 2),
    joined_date VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deliverymen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deliver_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(100),
    age INT,
    no_of_invoice VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Add a credit_balance column to the payments table
ALTER TABLE payments
ADD COLUMN credit_balance DECIMAL(10, 2) DEFAULT 0.00;

CREATE TABLE IF NOT EXISTS check_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50),
    issue_date DATE,
    expiry_date DATE,
     check_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



--email = admin@example.com
--pasword = password