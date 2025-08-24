const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
});

// Add Customer
ipcMain.handle("add-customer", (event, customer) => {
  const stmt = db.prepare(
    "INSERT INTO customers (name, contact, address) VALUES (?, ?, ?)"
  );
  const result = stmt.run(customer.name, customer.contact, customer.address);
  return result.lastInsertRowid;
});

// Get Customers
ipcMain.handle("get-customers", () => {
  return db.prepare("SELECT * FROM customers").all();
});

// Add Purchase
ipcMain.handle("add-purchase", (event, purchase) => {
  const stmt = db.prepare(
    "INSERT INTO purchases (customer_id, item, amount, date) VALUES (?, ?, ?, ?)"
  );
  stmt.run(purchase.customer_id, purchase.item, purchase.amount, purchase.date);
});

// Get Purchases by Customer
ipcMain.handle("get-purchases", (event, customerId) => {
  return db
    .prepare("SELECT * FROM purchases WHERE customer_id = ?")
    .all(customerId);
});
