const db = require("./db");

const createCategoriesTable = `
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);
`;

const insertCategories = `
INSERT IGNORE INTO categories (name) VALUES
('Food'),
('Shopping'),
('Entertainment'),
('Travel'),
('Utilities'),
('Health'),
('Other');
`;

const alterExpensesTable = `
ALTER TABLE expenses ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES categories(id);
`;

db.query(createCategoriesTable, (err) => {
  if (err) {
    console.error("Error creating categories table:", err);
  } else {
    console.log("Categories table created");
    // Insert categories
    db.query(insertCategories, (err) => {
      if (err) {
        console.error("Error inserting categories:", err);
      } else {
        console.log("Categories inserted");
        // Alter expenses table
        db.query(alterExpensesTable, (err) => {
          if (err) {
            console.error("Error altering expenses table:", err);
          } else {
            console.log("Expenses table altered with category_id");
          }
          db.end();
        });
      }
    });
  }
});