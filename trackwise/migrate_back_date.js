const db = require("./db");

const alterExpensesTableBack = `
ALTER TABLE expenses MODIFY COLUMN date DATE;
`;

db.query(alterExpensesTableBack, (err) => {
  if (err) {
    console.error("Error altering expenses table back to DATE:", err);
  } else {
    console.log("Expenses table date column altered back to DATE");
  }
});

db.end();