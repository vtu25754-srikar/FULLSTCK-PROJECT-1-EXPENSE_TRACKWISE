const db = require("./db");

const newCategories = [
  { id: 1, name: 'Food' },
  { id: 2, name: 'Travel' },
  { id: 3, name: 'Shopping' },
  { id: 4, name: 'Bills' },
  { id: 5, name: 'Rent' },
  { id: 6, name: 'Electricity' },
  { id: 7, name: 'Internet' },
  { id: 8, name: 'Medical' },
  { id: 9, name: 'Entertainment' }
];

// Delete all and recreate
const deleteSql = "TRUNCATE TABLE categories";

db.query(deleteSql, (err) => {
  if (err) {
    console.error("Error truncating categories:", err);
  } else {
    console.log("Categories table truncated");
    
    // Insert new categories
    const insertSql = "INSERT INTO categories (id, name) VALUES (?, ?)";
    let completed = 0;
    
    newCategories.forEach(cat => {
      db.query(insertSql, [cat.id, cat.name], (err) => {
        if (err) {
          console.error("Error inserting category:", err);
        } else {
          completed++;
          console.log(`Category ${cat.name} inserted (${completed}/${newCategories.length})`);
          
          if (completed === newCategories.length) {
            console.log("All categories updated successfully");
            db.end();
          }
        }
      });
    });
  }
});