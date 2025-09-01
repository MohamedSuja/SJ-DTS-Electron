const Database = require("better-sqlite3");

let db;
try {
  db = new Database("customer.db");
  console.log("Database connected successfully");
} catch (error) {
  console.error("Error connecting to database:", error);
  throw error;
}

// Create tables
try {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  console.log("Customers table created/verified successfully");

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      item_name TEXT NOT NULL,
      description TEXT,
      quantity INTEGER DEFAULT 1,
      unit_price REAL NOT NULL,
      total_amount REAL NOT NULL,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `
  ).run();
  console.log("Purchases table created/verified successfully");
} catch (error) {
  console.error("Error creating tables:", error);
  throw error;
}

// Create indexes for better search performance
try {
  db.prepare(
    "CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name)"
  ).run();
  db.prepare(
    "CREATE INDEX IF NOT EXISTS idx_customers_contact ON customers(contact)"
  ).run();
  db.prepare(
    "CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id)"
  ).run();
  console.log("Database indexes created/verified successfully");
} catch (error) {
  console.error("Error creating indexes:", error);
  throw error;
}

module.exports = db;
