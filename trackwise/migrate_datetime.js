const db = require("./db");

const alterExpensesTable = `
ALTER TABLE expenses MODIFY COLUMN date DATETIME;
`;

db.query(alterExpensesTable, (err) => {
  if (err) {
    console.error("Error altering expenses table:", err);
  } else {
    console.log("Expenses table date column altered to DATETIME");
  }
});

db.end();