const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all categories - MUST be BEFORE /:user_id route
const fs = require('fs');

router.get("/categories", (req, res) => {
  const sql = "SELECT id, name FROM categories ORDER BY name";
  console.log("Executing categories query");
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Categories query error:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Categories query returned:", results);
    try {
      fs.writeFileSync('last_categories.json', JSON.stringify(results));
    } catch (e) {
      console.error('Could not write categories to file', e);
    }
    res.json(results);
  });
});

router.post("/add", (req, res) => {
  const { user_id, amount, description, date, category } = req.body;
  
  // Validate input
  if(!user_id || !amount || !description || !date || !category){
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get category_id by name
  const categorySql = "SELECT id FROM categories WHERE name = ?";
  db.query(categorySql, [category], (err, categoryResult) => {
    if (err) {
      console.error("Category query error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!categoryResult || categoryResult.length === 0) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const category_id = categoryResult[0].id;

    const insertSql = "INSERT INTO expenses (user_id, amount, description, date, category_id) VALUES (?, ?, ?, ?, ?)";
    db.query(insertSql, [user_id, amount, description, date, category_id], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: err.message });
    }

    // Get user's monthly limit
    const limitSql = "SELECT monthlyLimit FROM users WHERE id = ?";
    db.query(limitSql, [user_id], (err, limitResult) => {
      if (err) {
        console.error("Limit query error:", err);
        return res.status(500).json({ error: err.message });
      }
      
      if(!limitResult || limitResult.length === 0){
        return res.status(400).json({ error: "User not found" });
      }
      
      const limit = parseFloat(limitResult[0].monthlyLimit) || 0;

      // Sum expenses for current month
      const sumSql = "SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())";
      db.query(sumSql, [user_id], (err, sumResult) => {
        if (err) {
          console.error("Sum query error:", err);
          return res.status(500).json({ error: err.message });
        }
        
        const total = parseFloat(sumResult[0].total) || 0;

        let message = "Expense added successfully";
        if (total > limit) {
          message += ". ⚠️ Warning: You have exceeded your monthly limit!";
        }

        res.json({ message });
      });
    });
  });
});
});

router.get("/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT e.*, c.name as category FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? ORDER BY e.date DESC";
  db.query(sql, [user_id], (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

router.get("/single/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT e.*, c.name as category FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if(result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { description, amount, date, category } = req.body;
  
  if(!description || !amount || !date || !category){
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get category_id by name
  const categorySql = "SELECT id FROM categories WHERE name = ?";
  db.query(categorySql, [category], (err, categoryResult) => {
    if (err) {
      console.error("Category query error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!categoryResult || categoryResult.length === 0) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const category_id = categoryResult[0].id;

    const sql = "UPDATE expenses SET description = ?, amount = ?, date = ?, category_id = ? WHERE id = ?";
    db.query(sql, [description, amount, date, category_id, id], (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Expense updated successfully" });
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM expenses WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Expense deleted" });
  });
});

module.exports = router;