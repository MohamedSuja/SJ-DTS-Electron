# Customer & Purchase Management System

A modern Electron desktop application for managing customers and tracking their purchases efficiently.

## Features

### Customer Management
- ✅ **Add Customers**: Create new customer records with name, phone, email, and address
- ✅ **Edit Customers**: Update existing customer information
- ✅ **Delete Customers**: Remove customers and their associated purchase history
- ✅ **Search Customers**: Search by name or phone number in real-time
- ✅ **View Customer Details**: See all customer information in organized cards

### Purchase Management
- ✅ **Add Purchases**: Record new purchases with item details, quantity, and pricing
- ✅ **Edit Purchases**: Modify existing purchase records
- ✅ **Delete Purchases**: Remove individual purchase entries
- ✅ **View Purchase History**: See all purchases with customer information
- ✅ **Automatic Total Calculation**: Real-time calculation of total amounts
- ✅ **Sales Summary**: View total sales amount

### User Interface
- 🎨 **Modern Design**: Beautiful gradient backgrounds and card-based layout
- 📱 **Responsive**: Works on different screen sizes
- 🗂️ **Tabbed Interface**: Separate tabs for customers and purchases
- 🔍 **Real-time Search**: Instant search functionality
- 📊 **Visual Feedback**: Hover effects and smooth transitions

## Installation

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the application**:
   ```bash
   npm start
   ```

## Usage

### Managing Customers

1. **Adding a Customer**:
   - Go to the "Customers" tab
   - Fill in the customer form (Name and Phone are required)
   - Click "Save Customer"

2. **Searching Customers**:
   - Use the search box at the top of the Customers tab
   - Type customer name or phone number
   - Results update in real-time

3. **Editing a Customer**:
   - Click the "Edit" button on any customer card
   - Modify the information in the form
   - Click "Save Customer"

4. **Deleting a Customer**:
   - Click the "Delete" button on any customer card
   - Confirm the deletion (this will also delete all associated purchases)

### Managing Purchases

1. **Adding a Purchase**:
   - Go to the "Purchases" tab
   - Select a customer from the dropdown
   - Fill in item details (Item Name, Quantity, Unit Price)
   - The total amount is calculated automatically
   - Click "Save Purchase"

2. **Viewing Purchase History**:
   - All purchases are displayed in the Purchases tab
   - Each purchase shows customer name, item details, and pricing
   - Total sales amount is displayed at the bottom

3. **Editing a Purchase**:
   - Click the "Edit" button on any purchase card
   - Modify the information in the form
   - Click "Save Purchase"

4. **Deleting a Purchase**:
   - Click the "Delete" button on any purchase card
   - Confirm the deletion

### Viewing Customer Purchases

- Click "View Purchases" on any customer card to see only that customer's purchase history
- The application will switch to the Purchases tab and filter the results

## Database

The application uses SQLite for data storage:
- **Database file**: `customer.db` (created automatically)
- **Tables**: 
  - `customers`: Customer information
  - `purchases`: Purchase records with foreign key to customers

## Technical Details

- **Framework**: Electron
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Vanilla JavaScript with modern CSS
- **Architecture**: IPC-based communication between main and renderer processes

## File Structure

```
SJ-DTS-Electron/
├── main.js          # Main Electron process
├── preload.js       # Preload script for IPC
├── renderer.js      # Frontend JavaScript
├── index.html       # Main UI
├── db.js           # Database setup and configuration
├── customer.db     # SQLite database (auto-generated)
└── package.json    # Project configuration
```

## Development

To run in development mode:
```bash
npm run dev
```

## Building

To build the application for distribution:
```bash
npm run build
```

## Requirements

- Node.js (v14 or higher)
- npm or yarn

## License

ISC License

---

**Note**: This application stores data locally in a SQLite database. Make sure to backup the `customer.db` file regularly to prevent data loss.
