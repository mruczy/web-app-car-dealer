import { db } from "../db.js"

export const getVehicles = (req,res) => {
    const q = "SELECT * FROM car_dealer.vehicles"
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        return res.status(200).json(data);
    });
};

export const getVehicleById = (req,res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle ID" });
    }
    const q = "SELECT * FROM car_dealer.vehicles WHERE idvehicles = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (data.length === 0) return res.status(404).json({ error: "Client not found" });
        return res.status(200).json(data);
    });
};

export const createVehicle = (req,res) => {
    const { brand, model, engine, year, body_type, color } = req.body;

    // Validation
    if (!brand || !model || !engine || !year || !body_type || !color) {
        return res.status(400).json({ error: "Brand, model, engine, year, body type, and color are required" });
    }
    if (typeof brand !== "string" || !/^[A-Za-z\s]{1,50}$/.test(brand)) {
        return res.status(400).json({ error: "Brand must be a string with letters and spaces only (max 50 characters)" });
    }
    if (typeof model !== "string" || !/^[A-Za-z0-9\s]{1,50}$/.test(model)) {
        return res.status(400).json({ error: "Model must be a string with letters, numbers, and spaces only (max 50 characters)" });
    }
    if (typeof engine !== "string" || !/^[A-Za-z0-9\s.]{1,50}$/.test(engine)) {
        return res.status(400).json({ error: "Engine must be a string with letters, numbers, spaces, and dots only (max 50 characters)" });
    }
    if (!Number.isInteger(Number(year)) || year < 1900 || year > new Date().getFullYear() + 1) {
        return res.status(400).json({ error: `Year must be an integer between 1900 and ${new Date().getFullYear() + 1}` });
    }
    if (typeof body_type !== "string" || !/^[A-Za-z\s]{1,50}$/.test(body_type)) {
        return res.status(400).json({ error: "Body type must be a string with letters and spaces only (max 50 characters)" });
    }
    if (typeof color !== "string" || !/^[A-Za-z\s]{1,50}$/.test(color)) {
        return res.status(400).json({ error: "Color must be a string with letters and spaces only (max 50 characters)" });
    }

    const q = `
        INSERT INTO car_dealer.vehicles (brand, model, engine, year, body_type, color)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    db.query(q, [brand, model, engine, year, body_type, color], (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        return res.status(201).json({ idvehicles: data.insertId, message: "Vehicle created successfully" });
    });
}

export const updateVehicle = (req,res) => {
    const { id } = req.params;
    const { brand, model, engine, year, body_type, color } = req.body;

    // Validation 
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle ID" });
    }
    if (!brand || !model || !engine || !year || !body_type || !color) {
        return res.status(400).json({ error: "Brand, model, engine, year, body type, and color are required" });
    }
    if (typeof brand !== "string" || !/^[A-Za-z\s]{1,50}$/.test(brand)) {
        return res.status(400).json({ error: "Brand must be a string with letters and spaces only (max 50 characters)" });
    }
    if (typeof model !== "string" || !/^[A-Za-z0-9\s]{1,50}$/.test(model)) {
        return res.status(400).json({ error: "Model must be a string with letters, numbers, and spaces only (max 50 characters)" });
    }
    if (typeof engine !== "string" || !/^[A-Za-z0-9\s.]{1,50}$/.test(engine)) {
        return res.status(400).json({ error: "Engine must be a string with letters, numbers, spaces, and dots only (max 50 characters)" });
    }
    if (!Number.isInteger(Number(year)) || year < 1900 || year > new Date().getFullYear() + 1) {
        return res.status(400).json({ error: `Year must be an integer between 1900 and ${new Date().getFullYear() + 1}` });
    }
    if (typeof body_type !== "string" || !/^[A-Za-z\s]{1,50}$/.test(body_type)) {
        return res.status(400).json({ error: "Body type must be a string with letters and spaces only (max 50 characters)" });
    }
    if (typeof color !== "string" || !/^[A-Za-z\s]{1,50}$/.test(color)) {
        return res.status(400).json({ error: "Color must be a string with letters and spaces only (max 50 characters)" });
    }

    const q = `
        UPDATE car_dealer.vehicles
        SET brand = ?, model = ?, engine = ?, year = ?, body_type = ?, color = ?
        WHERE idvehicles = ?
    `;
    db.query(q, [brand, model, engine, year, body_type, color, id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Vehicle not found" });
        return res.status(200).json({ message: "Vehicle updated successfully" });
    });
}

export const deleteVehicle = (req,res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle ID"});
    }
    db.query("DELETE FROM vehicles WHERE idvehicles = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Vehicle not found" });
        res.status(200).json({ message: "Vehicle deleted successfully" });
    })
}