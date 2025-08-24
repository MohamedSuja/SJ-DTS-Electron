const Database = require("better-sqlite3");
const db = new Database("customer.db");

// Create tables
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact TEXT,
    address TEXT
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    item TEXT,
    amount REAL,
    date TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )
`
).run();

module.exports = db;
