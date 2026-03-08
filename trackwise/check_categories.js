const db = require("./db");

const checkCategories = "SELECT * FROM categories";

db.query(checkCategories, (err, results) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Categories:", results);
  }
  db.end();
});