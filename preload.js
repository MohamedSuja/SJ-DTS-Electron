const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Customer Management
  addCustomer: (customer) => ipcRenderer.invoke("add-customer", customer),
  getCustomers: () => ipcRenderer.invoke("get-customers"),
  getCustomer: (id) => ipcRenderer.invoke("get-customer", id),
  updateCustomer: (customer) => ipcRenderer.invoke("update-customer", customer),
  deleteCustomer: (id) => ipcRenderer.invoke("delete-customer", id),
  searchCustomers: (searchTerm) => ipcRenderer.invoke("search-customers", searchTerm),
  
  // Purchase Management
  addPurchase: (purchase) => ipcRenderer.invoke("add-purchase", purchase),
  getPurchases: (customerId) => ipcRenderer.invoke("get-purchases", customerId),
  getAllPurchases: () => ipcRenderer.invoke("get-all-purchases"),
  updatePurchase: (purchase) => ipcRenderer.invoke("update-purchase", purchase),
  deletePurchase: (id) => ipcRenderer.invoke("delete-purchase", id),
});
