const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  addCustomer: (customer) => ipcRenderer.invoke("add-customer", customer),
  getCustomers: () => ipcRenderer.invoke("get-customers"),
  addPurchase: (purchase) => ipcRenderer.invoke("add-purchase", purchase),
  getPurchases: (customerId) => ipcRenderer.invoke("get-purchases", customerId),
});
