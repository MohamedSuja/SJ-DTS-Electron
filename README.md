# SJ-DTS-Electron

A desktop application built with Electron for managing DTH (Direct-to-Home) customer data and purchases. This application provides a simple interface for tracking customers and their purchase history using SQLite database.

## Features

- **Customer Management**: Add and view customer information (name, contact, address)
- **Purchase Tracking**: Record and view customer purchases with items, amounts, and dates
- **SQLite Database**: Local data storage using better-sqlite3
- **Cross-platform**: Works on Windows, macOS, and Linux

## Project Structure

```
SJ-DTS-Electron/
├── main.js              # Main Electron process
├── preload.js           # Preload script for secure IPC communication
├── renderer.js          # Renderer process script
├── index.html           # Main application window
├── db.js                # Database configuration and setup
├── customer.db          # SQLite database file
├── src/
│   └── Screens/
│       └── Home/
│           └── index.jsx # React component (currently empty)
├── package.json         # Project dependencies and scripts
└── README.md           # This file
```

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd SJ-DTS-Electron
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Rebuild native modules for Electron:
   ```bash
   ./node_modules/.bin/electron-rebuild
   ```

## Usage

### Development

To run the application in development mode:

```bash
npm start
# or
yarn start
```

This will launch the Electron application with the main window.

### Database Operations

The application provides the following database operations through IPC (Inter-Process Communication):

#### Customer Operations

- **Add Customer**: Insert new customer with name, contact, and address
- **Get Customers**: Retrieve all customers from the database

#### Purchase Operations

- **Add Purchase**: Record a new purchase with customer ID, item, amount, and date
- **Get Purchases**: Retrieve all purchases for a specific customer

## Dependencies

### Production Dependencies

- `better-sqlite3`: SQLite database driver for Node.js

### Development Dependencies

- `electron`: Cross-platform desktop application framework
- `@electron/rebuild`: Rebuild native Node.js modules for Electron

## Database Schema

The application uses SQLite with the following tables:

### Customers Table

- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `contact` (TEXT)
- `address` (TEXT)

### Purchases Table

- `id` (INTEGER PRIMARY KEY)
- `customer_id` (INTEGER, FOREIGN KEY)
- `item` (TEXT)
- `amount` (REAL)
- `date` (TEXT)

## Development

### Main Process (main.js)

The main process handles:

- Creating the application window
- Database operations through IPC handlers
- Application lifecycle management

### Renderer Process

- `index.html`: Main application interface
- `renderer.js`: Frontend logic and UI interactions
- `preload.js`: Secure bridge between main and renderer processes

### React Components

The project includes a React component structure in `src/Screens/Home/` for future UI enhancements.

## Building

To build the application for distribution, you'll need to add build scripts to `package.json`:

```json
{
  "scripts": {
    "build": "electron-builder",
    "dist": "npm run build"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.
