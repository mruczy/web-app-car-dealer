import { db } from "../db.js"

export const getClients = (req, res) => {
    const q = "SELECT * FROM car_dealer.clients";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        return res.status(200).json(data);
    });
};

export const getClientById = (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid client ID" });
    }
    const q = "SELECT * FROM car_dealer.clients WHERE idclients = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (data.length === 0) return res.status(404).json({ error: "Client not found" });
        return res.status(200).json(data);
    });
};

export const createClient = (req, res) => {
    const { first_name, last_name, email, phone, adress } = req.body;

    // Validation
    if (!first_name || !last_name) {
        return res.status(400).json({ error: "First name and last name are required" });
    }
    if (typeof first_name !== "string" || !/^[A-Za-z\s]{1,255}$/.test(first_name)) {
        return res.status(400).json({ error: "First name must be a string with letters and spaces only (max 255 characters)" });
    }
    if (typeof last_name !== "string" || !/^[A-Za-z\s]{1,255}$/.test(last_name)) {
        return res.status(400).json({ error: "Last name must be a string with letters and spaces only (max 255 characters)" });
    }
    if (email && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255)) {
        return res.status(400).json({ error: "Invalid email format (max 255 characters)" });
    }
    if (phone && (typeof phone !== "string" || !/^\d[\d-]{0,18}\d$/.test(phone) || phone.length > 20)) {
        return res.status(400).json({ error: "Phone must contain only digits and dashes (max 20 characters)" });
    }
    if (adress && (typeof adress !== "string" || adress.length > 255)) {
        return res.status(400).json({ error: "Address must be a string (max 255 characters)" });
    }

    const q = `
        INSERT INTO car_dealer.clients (first_name, last_name, email, phone, adress)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(q, [first_name, last_name, email || null, phone || null, adress || null], (err, data) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        return res.status(201).json({ idclients: data.insertId, message: "Client created successfully" });
    });
};

export const updateClient = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, adress } = req.body;

    // Validation
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid client ID" });
    }
    if (!first_name || !last_name) {
        return res.status(400).json({ error: "First name and last name are required" });
    }
    if (typeof first_name !== "string" || !/^[A-Za-z\s]{1,255}$/.test(first_name)) {
        return res.status(400).json({ error: "First name must be a string with letters and spaces only (max 255 characters)" });
    }
    if (typeof last_name !== "string" || !/^[A-Za-z\s]{1,255}$/.test(last_name)) {
        return res.status(400).json({ error: "Last name must be a string with letters and spaces only (max 255 characters)" });
    }
    if (email && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255)) {
        return res.status(400).json({ error: "Invalid email format (max 255 characters)" });
    }
    if (phone && (typeof phone !== "string" || !/^\d[\d-]{0,18}\d$/.test(phone) || phone.length > 20)) {
        return res.status(400).json({ error: "Phone must contain only digits and dashes (max 20 characters)" });
    }
    if (adress && (typeof adress !== "string" || adress.length > 255)) {
        return res.status(400).json({ error: "Address must be a string (max 255 characters)" });
    }

    const q = `
        UPDATE car_dealer.clients
        SET first_name = ?, last_name = ?, email = ?, phone = ?, adress = ?
        WHERE idclients = ?
    `;
    db.query(q, [first_name, last_name, email || null, phone || null, adress || null, id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Client not found" });
    res.status(200).json({ message: "Client updated successfully" });
    });
};

export const deleteClient = (req,res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid client ID" });
    }
    db.query("DELETE FROM clients WHERE idclients = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Client not found" });
        res.status(200).json({ message: "Client deleted successfully" });
    })
}