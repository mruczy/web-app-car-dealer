import { db } from "../db.js"

export const getOrders = (req,res) => {
    const q = "SELECT * FROM car_dealer.orders";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        return res.status(200).json(data);
    });
};

export const getOrderById = (req,res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
    }
    const q = "SELECT * FROM car_dealer.orders WHERE idorders = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (data.length === 0) return res.status(404).json({ error: "Order not found" });
        return res.status(200).json(data);
    });
};

export const createOrder = (req, res) => {
    const { client_id, inventory_id, status, sale_price } = req.body;

    // Validation
    if (!client_id || isNaN(client_id) || client_id <= 0) {
        return res.status(400).json({ error: "Valid client ID is required" });
    }
    if (!inventory_id || isNaN(inventory_id) || inventory_id <= 0) {
        return res.status(400).json({ error: "Valid inventory ID is required" });
    }
    if (!["submitted", "in_progress", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Status must be one of: submitted, in_progress, cancelled" });
    }
    if (!sale_price || isNaN(sale_price) || sale_price < 0 || sale_price > 9999999999.99) {
        return res.status(400).json({ error: "Sale price must be a non-negative number (max $9,999,999,999.99)" });
    }

    // Verify client_id
    db.query("SELECT idclients FROM car_dealer.clients WHERE idclients = ?", [client_id], (err, clientResults) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (clientResults.length === 0) return res.status(400).json({ error: "Invalid client ID" });

        db.query("SELECT idinventory FROM car_dealer.inventory WHERE idinventory = ?", [inventory_id], (err, inventoryResults) => {
            if (err) return res.status(500).json({ error: "Database error: " + err.message });
            if (inventoryResults.length === 0) return res.status(400).json({ error: "Invalid inventory ID" });

            const q = `
                INSERT INTO car_dealer.orders (client_id, inventory_id, status, sale_price)
                VALUES (?, ?, ?, ?)
            `;
            db.query(q, [client_id, inventory_id, status, sale_price], (err, data) => {
                if (err) return res.status(500).json({ error: "Database error: " + err.message });
                return res.status(201).json({ idorders: data.insertId, message: "Order created successfully" });
            });
        });
    });
};

export const updateOrder = (req, res) => {
    const { id } = req.params;
    const { client_id, inventory_id, status, sale_price } = req.body;

    // Validation
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
    }
    if (!client_id || isNaN(client_id) || client_id <= 0) {
        return res.status(400).json({ error: "Valid client ID is required" });
    }
    if (!inventory_id || isNaN(inventory_id) || inventory_id <= 0) {
        return res.status(400).json({ error: "Valid inventory ID is required" });
    }
    if (!["submitted", "in_progress", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Status must be one of: submitted, in_progress, cancelled" });
    }
    if (!sale_price || isNaN(sale_price) || sale_price < 0 || sale_price > 9999999999.99) {
        return res.status(400).json({ error: "Sale price must be a non-negative number (max $9,999,999,999.99)" });
    }

    // Verify client_id
    db.query("SELECT idclients FROM car_dealer.clients WHERE idclients = ?", [client_id], (err, clientResults) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (clientResults.length === 0) return res.status(400).json({ error: "Invalid client ID" });

        db.query("SELECT idinventory FROM car_dealer.inventory WHERE idinventory = ?", [inventory_id], (err, inventoryResults) => {
            if (err) return res.status(500).json({ error: "Database error: " + err.message });
            if (inventoryResults.length === 0) return res.status(400).json({ error: "Invalid inventory ID" });

            const q = `
                UPDATE car_dealer.orders
                SET client_id = ?, inventory_id = ?, status = ?, sale_price = ?
                WHERE idorders = ?
            `;

            db.query(q, [client_id, inventory_id, status, sale_price, id], (err, results) => {
                if (err) return res.status(500).json({ error: "Database error: " + err.message });
                if (results.affectedRows === 0) return res.status(404).json({ error: "Order not found" });
                return res.status(200).json({ message: "Order updated successfully" });
            });
        });
    });
};

export const deleteOrder = (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
    }
    db.query("DELETE FROM car_dealer.orders WHERE idorders = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Order not found" });
        return res.status(200).json({ message: "Order deleted successfully" });
    });
};