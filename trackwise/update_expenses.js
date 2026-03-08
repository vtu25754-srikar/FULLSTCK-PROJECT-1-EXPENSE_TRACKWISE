const db = require("./db");

const updateExistingExpenses = `
UPDATE expenses e
JOIN categories c ON e.category = c.name
SET e.category_id = c.id
WHERE e.category_id IS NULL;
`;

db.query(updateExistingExpenses, (err) => {
  if (err) {
    console.error("Error updating existing expenses:", err);
  } else {
    console.log("Existing expenses updated with category_id");
  }
  db.end();
});