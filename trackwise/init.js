const db = require("./db");

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  monthlyLimit DECIMAL(10,2)
);
`;

const createExpensesTable = `
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  date DATE,
  category VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

db.query(createUsersTable, (err) => {
  if (err) {
    console.error("Error creating users table:", err);
  } else {
    console.log("Users table created or already exists");
  }
});

db.query(createExpensesTable, (err) => {
  if (err) {
    console.error("Error creating expenses table:", err);
  } else {
    console.log("Expenses table created or already exists");
  }
});

db.end();