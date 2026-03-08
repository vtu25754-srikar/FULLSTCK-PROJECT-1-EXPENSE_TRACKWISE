const db = require("./db");

const dropCategoryColumn = `
ALTER TABLE expenses DROP COLUMN category;
`;

db.query(dropCategoryColumn, (err) => {
  if (err) {
    console.error("Error dropping category column:", err);
  } else {
    console.log("Category column dropped from expenses table");
  }
  db.end();
});