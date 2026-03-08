const db = require('./db');

console.log('Adding test expense...');

db.query('INSERT INTO expenses (user_id, amount, description, date, category_id) VALUES (?, ?, ?, ?, ?)',
  [1, 100, 'Test Expense', '2024-01-15', 17],
  (err, result) => {
    if (err) {
      console.error('Error adding expense:', err);
      return;
    }
    
    console.log('Expense added successfully, ID:', result.insertId);
    
    // Check total
    db.query('SELECT COUNT(*) as count FROM expenses', (err, countResult) => {
      if (err) {
        console.error('Error counting:', err);
        return;
      }
      
      console.log('Total expenses in database:', countResult[0].count);
      process.exit();
    });
  });