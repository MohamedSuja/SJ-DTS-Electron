const customerForm = document.getElementById("customerForm");
const purchaseForm = document.getElementById("purchaseForm");
const customerList = document.getElementById("customerList");
const customerSelect = document.getElementById("customerSelect");
const purchaseList = document.getElementById("purchaseList");

// Load customers
async function loadCustomers() {
  const customers = await window.api.getCustomers();
  customerList.innerHTML = "";
  customerSelect.innerHTML = "";

  customers.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = `${c.name} - ${c.contact}`;
    li.addEventListener("click", () => loadPurchases(c.id));
    customerList.appendChild(li);

    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    customerSelect.appendChild(option);
  });
}

// Load purchases
async function loadPurchases(customerId) {
  const purchases = await window.api.getPurchases(customerId);
  purchaseList.innerHTML = "";
  purchases.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.item} - $${p.amount} on ${p.date}`;
    purchaseList.appendChild(li);
  });
}

// Add Customer
customerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const customer = {
    name: document.getElementById("name").value,
    contact: document.getElementById("contact").value,
    address: document.getElementById("address").value,
  };
  await window.api.addCustomer(customer);
  await loadCustomers();
});

// Add Purchase
purchaseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const purchase = {
    customer_id: document.getElementById("customerSelect").value,
    item: document.getElementById("item").value,
    amount: document.getElementById("amount").value,
    date: new Date().toISOString().split("T")[0],
  };
  await window.api.addPurchase(purchase);
  await loadPurchases(purchase.customer_id);
});

// Initial load
loadCustomers();
