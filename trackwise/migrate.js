const db = require("./db");

// Drop the existing expenses table and recreate it with correct schema
const dropExpensesTable = "DROP TABLE IF EXISTS expenses";
const createExpensesTable = `
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  date DATE,
  category VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
`;

db.query(dropExpensesTable, (err) => {
  if (err) {
    console.error("Drop table error:", err.message);
    process.exit(1);
  } else {
    console.log("Expenses table dropped");
    
    db.query(createExpensesTable, (err) => {
      if (err) {
        console.error("Create table error:", err.message);
        process.exit(1);
      } else {
        console.log("Expenses table created with correct schema");
        db.end();
      }
    });
  }
});

