const db = require("./db");

// First delete all expenses since we're changing categories
const deleteExpensesSql = "DELETE FROM expenses";
const deleteCategories = "DELETE FROM categories";
const insertNewCategories = `
INSERT INTO categories (name) VALUES
('Food'),
('Travel'),
('Shopping'),
('Bills'),
('Rent'),
('Electricity'),
('Internet'),
('Medical'),
('Entertainment');
`;

db.query(deleteExpensesSql, (err) => {
  if (err) {
    console.error("Error deleting expenses:", err);
  } else {
    console.log("All expenses deleted");
    
    db.query(deleteCategories, (err) => {
      if (err) {
        console.error("Error deleting categories:", err);
      } else {
        console.log("Old categories deleted");
        
        db.query(insertNewCategories, (err) => {
          if (err) {
            console.error("Error inserting new categories:", err);
          } else {
            console.log("New categories inserted");
          }
          db.end();
        });
      }
    });
  }
});