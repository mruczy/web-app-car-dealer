import { db } from "../db.js";

export const getInventories = (req, res) => {
    const q = `
        SELECT i.idinventory, i.vehicle_id, i.vin, i.location, i.purchase_price,
               v.brand, v.model, v.year
        FROM car_dealer.inventory i
        JOIN car_dealer.vehicles v ON i.vehicle_id = v.idvehicles
    `;
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        return res.status(200).json(data);
    });
};

export const getInventoryById = (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid inventory ID" });
    }
    const q = `
        SELECT i.idinventory, i.vehicle_id, i.vin, i.location, i.purchase_price,
               v.brand, v.model, v.year
        FROM car_dealer.inventory i
        JOIN car_dealer.vehicles v ON i.vehicle_id = v.idvehicles
        WHERE i.idinventory = ?
    `;
    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (data.length === 0) return res.status(404).json({ error: "Inventory item not found" });
        return res.status(200).json(data);
    });
};

export const createInventory = (req, res) => {
    const { vehicle_id, vin, location, purchase_price } = req.body;

    if (!vehicle_id || isNaN(vehicle_id) || vehicle_id <= 0) {
        return res.status(400).json({ error: "Valid vehicle ID is required" });
    }
    if (!vin || typeof vin !== "string" || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: "VIN must be a 17-character string with letters A-H, J-N, P, R-Z, and numbers" });
    }
    if (!["Magazyn A", "Magazyn B"].includes(location)) {
        return res.status(400).json({ error: "Location must be one of: Magazyn A, Magazyn B" });
    }
    if (!purchase_price || isNaN(purchase_price) || purchase_price < 0 || purchase_price > 9999999999.99) {
        return res.status(400).json({ error: "Purchase price must be a non-negative number (max $9,999,999,999.99)" });
    }

    db.query("SELECT idvehicles FROM car_dealer.vehicles WHERE idvehicles = ?", [vehicle_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.length === 0) return res.status(400).json({ error: "Invalid vehicle ID" });

        const q = `
            INSERT INTO car_dealer.inventory (vehicle_id, vin, location, purchase_price)
            VALUES (?, ?, ?, ?)
        `;
        db.query(q, [vehicle_id, vin, location, purchase_price], (err, data) => {
            if (err) return res.status(500).json({ error: "Database error: " + err.message });
            return res.status(201).json({ idinventory: data.insertId, message: "Inventory item created successfully" });
        });
    });
};

export const updateInventory = (req, res) => {
    const { id } = req.params;
    const { vehicle_id, vin, location, purchase_price } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid inventory ID" });
    }
    if (!vehicle_id || isNaN(vehicle_id) || vehicle_id <= 0) {
        return res.status(400).json({ error: "Valid vehicle ID is required" });
    }
    if (!vin || typeof vin !== "string" || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: "VIN must be a 17-character string with letters A-H, J-N, P, R-Z, and numbers" });
    }
    if (!["Magazyn A", "Magazyn B"].includes(location)) {
        return res.status(400).json({ error: "Location must be one of: Magazyn A, Magazyn B" });
    }
    if (!purchase_price || isNaN(purchase_price) || purchase_price < 0 || purchase_price > 9999999999.99) {
        return res.status(400).json({ error: "Purchase price must be a non-negative number (max $9,999,999,999.99)" });
    }

    db.query("SELECT idvehicles FROM car_dealer.vehicles WHERE idvehicles = ?", [vehicle_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.length === 0) return res.status(400).json({ error: "Invalid vehicle ID" });

        const q = `
            UPDATE car_dealer.inventory
            SET vehicle_id = ?, vin = ?, location = ?, purchase_price = ?
            WHERE idinventory = ?
        `;
        db.query(q, [vehicle_id, vin, location, purchase_price, id], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error: " + err.message });
            if (results.affectedRows === 0) return res.status(404).json({ error: "Inventory item not found" });
            return res.status(200).json({ message: "Inventory item updated successfully" });
        });
    });
};

export const deleteInventory = (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid inventory ID" });
    }
    db.query("DELETE FROM car_dealer.inventory WHERE idinventory = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Inventory item not found" });
        return res.status(200).json({ message: "Inventory item deleted successfully" });
    });
};