const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Customer Management Functions

// Add Customer
ipcMain.handle("add-customer", (event, customer) => {
  const stmt = db.prepare(
    "INSERT INTO customers (name, contact, address, email) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(customer.name, customer.contact, customer.address, customer.email);
  return result.lastInsertRowid;
});

// Get All Customers
ipcMain.handle("get-customers", () => {
  return db.prepare("SELECT * FROM customers ORDER BY name").all();
});

// Get Customer by ID
ipcMain.handle("get-customer", (event, id) => {
  return db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
});

// Update Customer
ipcMain.handle("update-customer", (event, customer) => {
  const stmt = db.prepare(
    "UPDATE customers SET name = ?, contact = ?, address = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  );
  const result = stmt.run(customer.name, customer.contact, customer.address, customer.email, customer.id);
  return result.changes > 0;
});

// Delete Customer
ipcMain.handle("delete-customer", (event, id) => {
  // First delete related purchases
  db.prepare("DELETE FROM purchases WHERE customer_id = ?").run(id);
  // Then delete customer
  const result = db.prepare("DELETE FROM customers WHERE id = ?").run(id);
  return result.changes > 0;
});

// Search Customers by Name or Contact
ipcMain.handle("search-customers", (event, searchTerm) => {
  const stmt = db.prepare(
    "SELECT * FROM customers WHERE name LIKE ? OR contact LIKE ? ORDER BY name"
  );
  const searchPattern = `%${searchTerm}%`;
  return stmt.all(searchPattern, searchPattern);
});

// Purchase Management Functions

// Add Purchase
ipcMain.handle("add-purchase", (event, purchase) => {
  const stmt = db.prepare(
    "INSERT INTO purchases (customer_id, item_name, description, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const result = stmt.run(
    purchase.customer_id, 
    purchase.item_name, 
    purchase.description, 
    purchase.quantity, 
    purchase.unit_price, 
    purchase.total_amount
  );
  return result.lastInsertRowid;
});

// Get Purchases by Customer
ipcMain.handle("get-purchases", (event, customerId) => {
  return db
    .prepare("SELECT * FROM purchases WHERE customer_id = ? ORDER BY purchase_date DESC")
    .all(customerId);
});

// Get All Purchases
ipcMain.handle("get-all-purchases", () => {
  return db
    .prepare(`
      SELECT p.*, c.name as customer_name 
      FROM purchases p 
      JOIN customers c ON p.customer_id = c.id 
      ORDER BY p.purchase_date DESC
    `)
    .all();
});

// Update Purchase
ipcMain.handle("update-purchase", (event, purchase) => {
  const stmt = db.prepare(
    "UPDATE purchases SET item_name = ?, description = ?, quantity = ?, unit_price = ?, total_amount = ? WHERE id = ?"
  );
  const result = stmt.run(
    purchase.item_name, 
    purchase.description, 
    purchase.quantity, 
    purchase.unit_price, 
    purchase.total_amount, 
    purchase.id
  );
  return result.changes > 0;
});

// Delete Purchase
ipcMain.handle("delete-purchase", (event, id) => {
  const result = db.prepare("DELETE FROM purchases WHERE id = ?").run(id);
  return result.changes > 0;
});
