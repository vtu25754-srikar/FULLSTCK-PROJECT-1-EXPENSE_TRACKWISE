const db = require("./db");

const disableForeignKey = "SET FOREIGN_KEY_CHECKS=0";
const deleteOldCategories = "DELETE FROM categories";
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
const enableForeignKey = "SET FOREIGN_KEY_CHECKS=1";

db.query(disableForeignKey, (err) => {
  if (err) {
    console.error("Error disabling foreign key checks:", err);
  } else {
    console.log("Foreign key checks disabled");
    db.query(deleteOldCategories, (err) => {
      if (err) {
        console.error("Error deleting old categories:", err);
      } else {
        console.log("Old categories deleted");
        db.query(insertNewCategories, (err) => {
          if (err) {
            console.error("Error inserting new categories:", err);
          } else {
            console.log("New categories inserted");
            db.query(enableForeignKey, (err) => {
              if (err) {
                console.error("Error enabling foreign key checks:", err);
              } else {
                console.log("Foreign key checks enabled");
              }
              db.end();
            });
          }
        });
      }
    });
  }
});