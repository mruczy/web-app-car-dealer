import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderAdd = () => {
    const [order, setOrder] = useState({
        client_id: "",
        inventory_id: "",
        status: "submitted",
        sale_price: "",
    });
    const [clients, setClients] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [clientsRes, inventoryRes, vehiclesRes] = await Promise.all([
                    axios.get("http://localhost:8800/clients"),
                    axios.get("http://localhost:8800/inventory"),
                    axios.get("http://localhost:8800/vehicles"),
                ]);
                console.log("Fetched vehicles:", clientsRes.data);
                console.log("Fetched vehicles:", inventoryRes.data);
                console.log("Fetched vehicles:", vehiclesRes.data);
                setClients(clientsRes.data);
                setInventory(inventoryRes.data);
                setVehicles(vehiclesRes.data);
                setErrors({});
            } catch (err) {
                setErrors({ fetch: err.response?.data?.error || "Failed to fetch necessary data" });
                console.error("AxiosError:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getVehicleDetails = (vehicleId) => {
        return vehicles.find(v => v.idvehicles === vehicleId) || {};
    }

    const validate = () => {
        const newErrors = {};
        if (!order.client_id) {
            newErrors.client_id = "Client is required";
        }

        if (!order.inventory_id) {
            newErrors.inventory_id = "Inventory item is required";
        }

        if (!['submitted', 'in_progress', 'cancelled'].includes(order.status)) {
            newErrors.status = "Invalid status selected";
        }

        if (!order.sale_price) {
            newErrors.sale_price = "Sale price is required";
        } else if (isNaN(order.sale_price) || order.sale_price < 0 || order.sale_price > 9999999999.99) {
            newErrors.sale_price = "Price must be a valid non-negative number.";
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("handleChange:", name, value);
        setOrder({ ...order, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            await axios.post("http://localhost:8800/orders", {
                ...order,
                client_id: parseInt(order.client_id),
                inventory_id: parseInt(order.inventory_id),
                sale_price: parseFloat(order.sale_price),
            });
            navigate("/orders");
        } catch (err) {
            setErrors({ submit: err.response?.data?.error || "Failed to add order" });
            console.error("AxiosError:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <h1>Add New Order</h1>
            {errors.submit && <div className="error">{errors.submit}</div>}
            {errors.fetch && <div className="error">{errors.fetch}</div>}
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Adding..." : "Add Order"}
            </button>
            <button 
                type="button" 
                onClick={() => navigate("/orders")} 
                disabled={loading}
            >
                Cancel
            </button>
            <div className="elements-inline">
                <form>
                    <div>
                        <label>Client:</label>
                        <select 
                            name="client_id" 
                            value={order.client_id} 
                            onChange={handleChange} 
                            disabled={loading || clients.length === 0}
                        >
                        <option value="">Select a Client</option>
                        {clients.map((client) => (
                            <option key={client.idclients} value={client.idclients}>
                                {client.first_name} {client.last_name}
                            </option>
                        ))}
                        </select>
                        {errors.client_id && <div className="error">{errors.client_id}</div>}
                        <label>Inventory Item (Vehicle):</label>
                        <select 
                            name="inventory_id" 
                            value={order.inventory_id} 
                            onChange={handleChange} 
                            disabled={loading || inventory.length === 0}
                        >
                        <option value="">Select an Inventory Item</option>
                        {inventory.map((item) => {
                            const vehicle = getVehicleDetails(item.vehicle_id);
                            return (
                            <option key={item.idinventory} value={item.idinventory}>
                                {vehicle.brand} {vehicle.model} ({vehicle.year}) - VIN: {item.vin}
                            </option>
                            )
                        })}
                        </select>
                        {errors.inventory_id && <div className="error">{errors.inventory_id}</div>}

                        <label>Status:</label>
                        <select name="status" value={order.status} onChange={handleChange} disabled={loading}>
                            <option value="submitted">Submitted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {errors.status && <div className="error">{errors.status}</div>}

                        <label>Sale Price:</label>
                        <input 
                            type="number" 
                            placeholder="Sale Price" 
                            name="sale_price" 
                            value={order.sale_price} 
                            onChange={handleChange} 
                            disabled={loading} 
                            step="0.01" min="0" 
                        />
                        {errors.sale_price && <div className="error">{errors.sale_price}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderAdd;