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
    "INSERT INTO customers (name, contact, address) VALUES (?, ?, ?)"
  );
  const result = stmt.run(customer.name, customer.contact, customer.address);
  return result.lastInsertRowid;
});

// Get All Customers
ipcMain.handle("get-customers", () => {
  try {
    console.log("Main process: Getting all customers...");

    const stmt = db.prepare("SELECT * FROM customers ORDER BY name");
    const customers = stmt.all();

    console.log("Main process: Found customers:", customers.length);
    return customers;
  } catch (error) {
    console.error("Main process: Error getting customers:", error);
    throw error;
  }
});

// Get Customer by ID
ipcMain.handle("get-customer", (event, id) => {
  return db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
});

// Update Customer
ipcMain.handle("update-customer", (event, customer) => {
  const stmt = db.prepare(
    "UPDATE customers SET name = ?, contact = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  );
  const result = stmt.run(
    customer.name,
    customer.contact,
    customer.address,
    customer.id
  );
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

// Item Management Functions

// Add Item
ipcMain.handle("add-item", (event, item) => {
  const stmt = db.prepare(
    "INSERT INTO items (name, description, unit_price) VALUES (?, ?, ?)"
  );
  const result = stmt.run(item.name, item.description, item.unit_price);
  return result.lastInsertRowid;
});

// Get All Items
ipcMain.handle("get-items", () => {
  try {
    console.log("Main process: Getting all items...");
    const stmt = db.prepare("SELECT * FROM items ORDER BY name");
    const items = stmt.all();
    console.log("Main process: Found items:", items.length);
    return items;
  } catch (error) {
    console.error("Main process: Error getting items:", error);
    throw error;
  }
});

// Get Item by ID
ipcMain.handle("get-item", (event, id) => {
  return db.prepare("SELECT * FROM items WHERE id = ?").get(id);
});

// Update Item
ipcMain.handle("update-item", (event, item) => {
  const stmt = db.prepare(
    "UPDATE items SET name = ?, description = ?, unit_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  );
  const result = stmt.run(
    item.name,
    item.description,
    item.unit_price,
    item.id
  );
  return result.changes > 0;
});

// Delete Item
ipcMain.handle("delete-item", (event, id) => {
  // Check if item is used in any purchases
  const purchaseCount = db
    .prepare("SELECT COUNT(*) as count FROM purchases WHERE item_id = ?")
    .get(id);
  if (purchaseCount.count > 0) {
    throw new Error("Cannot delete item that is used in purchases");
  }
  const result = db.prepare("DELETE FROM items WHERE id = ?").run(id);
  return result.changes > 0;
});

// Search Items by Name
ipcMain.handle("search-items", (event, searchTerm) => {
  const stmt = db.prepare(
    "SELECT * FROM items WHERE name LIKE ? ORDER BY name"
  );
  const searchPattern = `%${searchTerm}%`;
  return stmt.all(searchPattern);
});

// Purchase Management Functions

// Add Purchase
ipcMain.handle("add-purchase", (event, purchase) => {
  const stmt = db.prepare(
    "INSERT INTO purchases (customer_id, item_id, description, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const result = stmt.run(
    purchase.customer_id,
    purchase.item_id,
    purchase.description,
    purchase.quantity,
    purchase.unit_price,
    purchase.total_amount
  );
  return result.lastInsertRowid;
});

// Get Purchases by Customer
ipcMain.handle("get-purchases", (event, customerId) => {
  try {
    console.log("Main process: Getting purchases for customer ID:", customerId);

    if (!customerId || isNaN(customerId)) {
      throw new Error("Invalid customer ID provided");
    }

    const stmt = db.prepare(`
      SELECT p.*, c.name as customer_name, i.name as item_name 
      FROM purchases p 
      JOIN customers c ON p.customer_id = c.id 
      JOIN items i ON p.item_id = i.id
      WHERE p.customer_id = ? 
      ORDER BY p.purchase_date DESC
    `);
    const purchases = stmt.all(customerId);

    console.log("Main process: Found purchases:", purchases.length);
    return purchases;
  } catch (error) {
    console.error("Main process: Error getting purchases:", error);
    throw error;
  }
});

// Get All Purchases
ipcMain.handle("get-all-purchases", () => {
  try {
    console.log("Main process: Getting all purchases...");

    const stmt = db.prepare(`
      SELECT p.*, c.name as customer_name, i.name as item_name 
      FROM purchases p 
      JOIN customers c ON p.customer_id = c.id 
      JOIN items i ON p.item_id = i.id
      ORDER BY p.purchase_date DESC
    `);
    const purchases = stmt.all();

    console.log("Main process: Found total purchases:", purchases.length);
    return purchases;
  } catch (error) {
    console.error("Main process: Error getting all purchases:", error);
    throw error;
  }
});

// Update Purchase
ipcMain.handle("update-purchase", (event, purchase) => {
  const stmt = db.prepare(
    "UPDATE purchases SET item_id = ?, description = ?, quantity = ?, unit_price = ?, total_amount = ? WHERE id = ?"
  );
  const result = stmt.run(
    purchase.item_id,
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

// Test database connection
ipcMain.handle("test-db-connection", () => {
  try {
    const result = db.prepare("SELECT 1 as test").get();
    return { success: true, result: result };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return { success: false, error: error.message };
  }
});
