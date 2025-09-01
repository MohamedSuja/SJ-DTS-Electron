// Global variables
let currentCustomers = [];
let currentPurchases = [];
let editingCustomerId = null;
let editingPurchaseId = null;

// DOM elements
const customerForm = document.getElementById("customerForm");
const purchaseForm = document.getElementById("purchaseForm");
const customerList = document.getElementById("customerList");
const purchaseList = document.getElementById("purchaseList");
const customerSearch = document.getElementById("customerSearch");

// Tab functionality
function showTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Show selected tab content
  document.getElementById(tabName).classList.add("active");

  // Add active class to clicked tab
  event.target.classList.add("active");

  // Load data for the selected tab
  if (tabName === "customers") {
    loadCustomers();
  } else if (tabName === "purchases") {
    loadAllPurchases();
  }
}

// Customer Management Functions

async function loadCustomers() {
  try {
    currentCustomers = await window.api.getCustomers();
    displayCustomers(currentCustomers);
    updateCustomerSelect();
  } catch (error) {
    console.error("Error loading customers:", error);
    alert("Error loading customers");
  }
}

function displayCustomers(customers) {
  customerList.innerHTML = "";

  if (customers.length === 0) {
    customerList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">No customers found</p>';
    return;
  }

  customers.forEach((customer) => {
    const card = document.createElement("div");
    card.className = "customer-card";
    card.innerHTML = `
            <div class="customer-info">
                <div class="info-item">
                    <span class="info-label">Name</span>
                    <span class="info-value">${customer.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${customer.contact}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">Address</span>
                    <span class="info-value">${customer.address || "N/A"}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-success" onclick="editCustomer(${
                  customer.id
                })">Edit</button>
                <button class="btn btn-sm btn-primary" onclick="viewCustomerPurchases(${
                  customer.id
                })">View Purchases</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${
                  customer.id
                })">Delete</button>
            </div>
        `;
    customerList.appendChild(card);
  });
}

async function searchCustomers() {
  const searchTerm = customerSearch.value.trim();

  if (searchTerm === "") {
    await loadCustomers();
    return;
  }

  try {
    const searchResults = await window.api.searchCustomers(searchTerm);
    displayCustomers(searchResults);
  } catch (error) {
    console.error("Error searching customers:", error);
    alert("Error searching customers");
  }
}

async function addCustomer(customerData) {
  try {
    await window.api.addCustomer(customerData);
    await loadCustomers();
    resetCustomerForm();
    alert("Customer added successfully!");
  } catch (error) {
    console.error("Error adding customer:", error);
    alert("Error adding customer");
  }
}

async function updateCustomer(customerData) {
  try {
    const success = await window.api.updateCustomer(customerData);
    if (success) {
      await loadCustomers();
      resetCustomerForm();
      alert("Customer updated successfully!");
    } else {
      alert("Error updating customer");
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    alert("Error updating customer");
  }
}

async function editCustomer(customerId) {
  try {
    const customer = await window.api.getCustomer(customerId);
    if (customer) {
      editingCustomerId = customerId;
      document.getElementById("customerId").value = customer.id;
      document.getElementById("customerName").value = customer.name;
      document.getElementById("customerContact").value = customer.contact;

      document.getElementById("customerAddress").value = customer.address || "";
      document.getElementById("customerFormTitle").textContent =
        "Edit Customer";
    }
  } catch (error) {
    console.error("Error loading customer for edit:", error);
    alert("Error loading customer data");
  }
}

async function deleteCustomer(customerId) {
  if (
    confirm(
      "Are you sure you want to delete this customer? This will also delete all their purchase history."
    )
  ) {
    try {
      const success = await window.api.deleteCustomer(customerId);
      if (success) {
        await loadCustomers();
        await loadAllPurchases();
        alert("Customer deleted successfully!");
      } else {
        alert("Error deleting customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Error deleting customer");
    }
  }
}

function resetCustomerForm() {
  editingCustomerId = null;
  document.getElementById("customerForm").reset();
  document.getElementById("customerId").value = "";
  document.getElementById("customerFormTitle").textContent = "Add New Customer";
}

// Purchase Management Functions

async function loadAllPurchases() {
  try {
    currentPurchases = await window.api.getAllPurchases();
    displayPurchases(currentPurchases);
    updateCustomerSelect();

    // Reset the purchases tab title to default
    const purchaseTitle = document.querySelector("#purchases .list-title");
    if (purchaseTitle) {
      purchaseTitle.textContent = "Purchase History";
    }
  } catch (error) {
    console.error("Error loading purchases:", error);
    const purchaseList = document.getElementById("purchaseList");
    purchaseList.innerHTML =
      '<p style="text-align: center; color: #dc3545; padding: 20px;">Error loading purchases. Please try again.</p>';
  }
}

function displayPurchases(purchases) {
  purchaseList.innerHTML = "";

  if (purchases.length === 0) {
    purchaseList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">No purchases found</p>';
    return;
  }

  let totalAmount = 0;

  purchases.forEach((purchase) => {
    totalAmount += purchase.total_amount;

    const card = document.createElement("div");
    card.className = "purchase-card";
    card.innerHTML = `
            <div class="purchase-info">
                <div class="info-item">
                    <span class="info-label">Customer</span>
                    <span class="info-value">${purchase.customer_name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Item</span>
                    <span class="info-value">${purchase.item_name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Description</span>
                    <span class="info-value">${
                      purchase.description || "N/A"
                    }</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Quantity</span>
                    <span class="info-value">${purchase.quantity}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Unit Price</span>
                    <span class="info-value">$${purchase.unit_price.toFixed(
                      2
                    )}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Total</span>
                    <span class="info-value">$${purchase.total_amount.toFixed(
                      2
                    )}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date</span>
                    <span class="info-value">${new Date(
                      purchase.purchase_date
                    ).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-success" onclick="editPurchase(${
                  purchase.id
                })">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deletePurchase(${
                  purchase.id
                })">Delete</button>
            </div>
        `;
    purchaseList.appendChild(card);
  });

  // Add total section
  const totalSection = document.createElement("div");
  totalSection.className = "total-section";
  totalSection.innerHTML = `
        <div class="total-amount">Total Sales: $${totalAmount.toFixed(2)}</div>
    `;
  purchaseList.appendChild(totalSection);
}

async function addPurchase(purchaseData) {
  try {
    await window.api.addPurchase(purchaseData);
    await loadAllPurchases();
    resetPurchaseForm();
    alert("Purchase added successfully!");
  } catch (error) {
    console.error("Error adding purchase:", error);
    alert("Error adding purchase");
  }
}

async function updatePurchase(purchaseData) {
  try {
    const success = await window.api.updatePurchase(purchaseData);
    if (success) {
      await loadAllPurchases();
      resetPurchaseForm();
      alert("Purchase updated successfully!");
    } else {
      alert("Error updating purchase");
    }
  } catch (error) {
    console.error("Error updating purchase:", error);
    alert("Error updating purchase");
  }
}

async function editPurchase(purchaseId) {
  try {
    const purchase = currentPurchases.find((p) => p.id === purchaseId);
    if (purchase) {
      editingPurchaseId = purchaseId;
      document.getElementById("purchaseId").value = purchase.id;
      document.getElementById("purchaseCustomer").value = purchase.customer_id;
      document.getElementById("purchaseItem").value = purchase.item_name;
      document.getElementById("purchaseDescription").value =
        purchase.description || "";
      document.getElementById("purchaseQuantity").value = purchase.quantity;
      document.getElementById("purchaseUnitPrice").value = purchase.unit_price;
      document.getElementById("purchaseTotal").value = purchase.total_amount;
      document.getElementById("purchaseFormTitle").textContent =
        "Edit Purchase";
    }
  } catch (error) {
    console.error("Error loading purchase for edit:", error);
    alert("Error loading purchase data");
  }
}

async function deletePurchase(purchaseId) {
  if (confirm("Are you sure you want to delete this purchase?")) {
    try {
      const success = await window.api.deletePurchase(purchaseId);
      if (success) {
        await loadAllPurchases();
        alert("Purchase deleted successfully!");
      } else {
        alert("Error deleting purchase");
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      alert("Error deleting purchase");
    }
  }
}

function resetPurchaseForm() {
  editingPurchaseId = null;
  document.getElementById("purchaseForm").reset();
  document.getElementById("purchaseId").value = "";
  document.getElementById("purchaseQuantity").value = "1";
  document.getElementById("purchaseTotal").value = "";
  document.getElementById("purchaseFormTitle").textContent = "Add New Purchase";
}

function updateCustomerSelect() {
  const customerSelect = document.getElementById("purchaseCustomer");
  customerSelect.innerHTML = '<option value="">Select Customer</option>';

  currentCustomers.forEach((customer) => {
    const option = document.createElement("option");
    option.value = customer.id;
    option.textContent = `${customer.name} (${customer.contact})`;
    customerSelect.appendChild(option);
  });
}

function calculateTotal() {
  const quantity =
    parseFloat(document.getElementById("purchaseQuantity").value) || 0;
  const unitPrice =
    parseFloat(document.getElementById("purchaseUnitPrice").value) || 0;
  const total = quantity * unitPrice;
  document.getElementById("purchaseTotal").value = total.toFixed(2);
}

async function viewCustomerPurchases(customerId) {
  try {
    console.log("Starting viewCustomerPurchases for customer ID:", customerId);

    // Show loading state
    const purchaseList = document.getElementById("purchaseList");
    purchaseList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">Loading customer purchases...</p>';

    // Switch to purchases tab first
    showTab("purchases");

    // Get purchases for this specific customer
    console.log("Calling getPurchases API...");
    const purchases = await window.api.getPurchases(customerId);
    console.log("API response:", purchases);

    const customer = currentCustomers.find((c) => c.id === customerId);
    console.log("Found customer:", customer);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Display the purchases for this customer
    if (purchases && purchases.length > 0) {
      console.log("Displaying purchases:", purchases.length);
      displayPurchases(purchases);
    } else {
      console.log("No purchases found for customer");
      purchaseList.innerHTML = `<p style="text-align: center; color: #666; padding: 20px;">No purchases found for ${customer.name}</p>`;
    }

    // Update the tab title to show which customer's purchases we're viewing
    const purchaseTitle = document.querySelector("#purchases .list-title");
    if (purchaseTitle) {
      purchaseTitle.textContent = `Purchase History - ${customer.name}`;
    }

    // Add a "View All Purchases" button
    const viewAllButton = document.createElement("div");
    viewAllButton.style.textAlign = "center";
    viewAllButton.style.marginBottom = "20px";
    viewAllButton.innerHTML = `
            <button class="btn btn-secondary" onclick="loadAllPurchases()">
                ← View All Purchases
            </button>
        `;
    purchaseList.insertBefore(viewAllButton, purchaseList.firstChild);
  } catch (error) {
    console.error("Error loading customer purchases:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      customerId: customerId,
    });

    const purchaseList = document.getElementById("purchaseList");
    purchaseList.innerHTML = `
            <div style="text-align: center; color: #dc3545; padding: 20px;">
                <p>Error loading customer purchases.</p>
                <p style="font-size: 12px; margin-top: 10px;">Error: ${error.message}</p>
                <button class="btn btn-primary" onclick="loadAllPurchases()" style="margin-top: 15px;">
                    ← Back to All Purchases
                </button>
            </div>
        `;
  }
}

// Test database connection function
async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    const result = await window.api.testDbConnection();
    console.log("Database test result:", result);

    if (result.success) {
      alert("Database connection successful!");
    } else {
      alert(`Database connection failed: ${result.error}`);
    }
  } catch (error) {
    console.error("Error testing database connection:", error);
    alert(`Error testing database: ${error.message}`);
  }
}

// Event Listeners

customerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const customerData = {
    name: document.getElementById("customerName").value.trim(),
    contact: document.getElementById("customerContact").value.trim(),
    address: document.getElementById("customerAddress").value.trim(),
  };

  if (editingCustomerId) {
    customerData.id = editingCustomerId;
    await updateCustomer(customerData);
  } else {
    await addCustomer(customerData);
  }
});

purchaseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const purchaseData = {
    customer_id: parseInt(document.getElementById("purchaseCustomer").value),
    item_name: document.getElementById("purchaseItem").value.trim(),
    description: document.getElementById("purchaseDescription").value.trim(),
    quantity: parseInt(document.getElementById("purchaseQuantity").value),
    unit_price: parseFloat(document.getElementById("purchaseUnitPrice").value),
    total_amount: parseFloat(document.getElementById("purchaseTotal").value),
  };

  if (editingPurchaseId) {
    purchaseData.id = editingPurchaseId;
    await updatePurchase(purchaseData);
  } else {
    await addPurchase(purchaseData);
  }
});

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
  loadAllPurchases();
});
