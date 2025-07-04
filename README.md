# Car Dealership Management System

A full-stack web application for managing a car dealership, built with a **React** frontend and a **Node.js/Express.js** backend using **MySQL**. The application provides a complete system for handling clients, vehicle specifications, inventory, and sales orders through a RESTful API and a user-friendly interface.

## Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [Usage](#usage)
- [📝 API Endpoints](#-api-endpoints)
- [🗃️ Database Schema](#️-database-schema)
- [🔐 Environment Variables](#-environment-variables)

## ✨ Features
- **Client Management**: Full CRUD (Create, Read, Update, Delete) for customer records.
- **Vehicle Management**: Manage vehicle details like brand, model, engine, year, body type, and color.
- **Inventory Control**: Track vehicles in stock with VIN, location, and purchase price.
- **Order Processing**: Handle sales orders, linking clients to inventory items.
- **Responsive UI**: A clean and intuitive interface built with React.
- **Input Validation**: Robust server-side validation for all API inputs.
- **RESTful API**: A well-structured backend API for all data operations.

## 🛠️ Tech Stack
- **Frontend**:
  - React `18.x`
  - React Router `6.x`
  - SASS/SCSS
  - Axios
- **Backend**:
  - Node.js
  - Express.js
  - MySQL2 (MySQL database driver)
  - CORS
  - Dotenv
- **Database**:
  - MySQL

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm
- MySQL Server

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/car-dealer.git
cd car-dealer
```

### 2. Backend Setup
Navigate to the `api` folder:
```bash
cd api
```

Install dependencies:
```bash
npm install
```

Create a MySQL database (see [Database Schema](#-database-schema) for the script).

Create a `.env` file in the `api` directory for your database credentials (see [Environment Variables](#-environment-variables)).

### 3. Frontend Setup
Navigate to the `client` folder from the root directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

### 4. Running the Application
Start the backend server (from the `api` folder):
```bash
npm start
```
The backend will be available at `http://localhost:8800`.

Start the frontend application (from the `client` folder):
```bash
npm start
```
The frontend will open in your browser at `http://localhost:3000`.

## Usage
- Access the application in your browser at `http://localhost:3000`.
- Use the navigation bar to go to Clients, Vehicles, Inventory, or Orders.
- On each page, you can view, add, edit, and delete records.

## 📝 API Endpoints
The backend provides the following RESTful endpoints:

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | `/clients`          | Get all clients.               |
| GET    | `/clients/:id`      | Get a single client by ID.     |
| POST   | `/clients`          | Create a new client.           |
| PUT    | `/clients/:id`      | Update an existing client.     |
| DELETE | `/clients/:id`      | Delete a client.               |
| GET    | `/vehicles`         | Get all vehicles.              |
| GET    | `/vehicles/:id`     | Get a single vehicle by ID.    |
| POST   | `/vehicles`         | Create a new vehicle.          |
| PUT    | `/vehicles/:id`     | Update an existing vehicle.    |
| DELETE | `/vehicles/:id`     | Delete a vehicle.              |
| GET    | `/inventory`        | Get all inventory items with vehicle data. |
| GET    | `/inventory/:id`    | Get a single inventory item by ID. |
| POST   | `/inventory`        | Create a new inventory item.   |
| PUT    | `/inventory/:id`    | Update an existing inventory item. |
| DELETE | `/inventory/:id`    | Delete an inventory item.      |
| GET    | `/orders`           | Get all orders.                |
| GET    | `/orders/:id`       | Get a single order by ID.      |
| POST   | `/orders`           | Create a new order.            |
| PUT    | `/orders/:id`       | Update an existing order.      |
| DELETE | `/orders/:id`       | Delete an order.               |

## 🗃️ Database Schema
The MySQL database `car_dealer` consists of four tables. Run the script below to create the database and tables.

```sql
CREATE DATABASE IF NOT EXISTS car_dealer;

USE car_dealer;

CREATE TABLE `clients` (
  `idclients` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(20) NULL,
  `address` VARCHAR(255) NULL,
  PRIMARY KEY (`idclients`)
);

CREATE TABLE `vehicles` (
  `idvehicles` INT NOT NULL AUTO_INCREMENT,
  `brand` VARCHAR(50) NOT NULL,
  `model` VARCHAR(50) NOT NULL,
  `engine` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `body_type` VARCHAR(50) NOT NULL,
  `color` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idvehicles`)
);

CREATE TABLE `inventory` (
  `idinventory` INT NOT NULL AUTO_INCREMENT,
  `vehicle_id` INT NOT NULL,
  `vin` VARCHAR(17) NOT NULL UNIQUE,
  `location` ENUM('Magazyn A', 'Magazyn B') NOT NULL,
  `purchase_price` DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (`idinventory`),
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`idvehicles`) ON DELETE CASCADE
);

CREATE TABLE `orders` (
  `idorders` INT NOT NULL AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `inventory_id` INT NOT NULL UNIQUE, -- An inventory item can only be in one order
  `status` ENUM('submitted', 'in_progress', 'cancelled') NOT NULL,
  `sale_price` DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (`idorders`),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`idclients`),
  FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`idinventory`)
);
```

## 🔐 Environment Variables
For security, backend configurations should be stored in environment variables.

Create a `.env` file in the `api` directory: `api/.env`

Add the following variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=car_dealer
```

To use these variables, install `dotenv`:
```bash
cd api
npm install dotenv
```

Update `api/db.js` to load and use these variables:
```javascript
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env file

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
```

MIT License
