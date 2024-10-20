CREATE DATABASE currency_tracking_db;

DROP DATABASE currency_tracking_db;
DROP TABLE newsletter_subscribers;
DROP TABLE users;
USE currency_tracking_db;

-- Newsletter Table
CREATE TABLE newsletter_subscribers(
	subscribers_id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL UNIQUE
);

-- User Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    country ENUM(
        'us', 'ca', 'uk', 'de', 'fr', 'au', 
        'in', 'ng', 'za', 'cn', 'jp'
    ) NOT NULL,
    currency ENUM(
        'usd', 'eur', 'gbp', 'jpy', 'aud', 
        'cad', 'ngn', 'zar', 'inr', 'cny'
    ) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Financial Records Table
CREATE TABLE financial_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    income DECIMAL(10, 2) DEFAULT 0.00,
    expenses DECIMAL(10, 2) DEFAULT 0.00,
    savings DECIMAL(10, 2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Cards Table
CREATE TABLE cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    card_type VARCHAR(50),
    card_amount DECIMAL(10, 2) DEFAULT 0.00,
    card_number VARCHAR(19),
    expiry_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transactions
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    transaction_title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_type ENUM('income', 'expense'),
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- drop table transactions;

SELECT * FROM newsletter_subscribers ORDER BY subscribers_id;
SELECT * FROM users;
SELECT * FROM transactions;
SELECT * FROM financial_records; 
SELECT * FROM cards;
-- drop table cards;