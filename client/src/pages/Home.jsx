import React from "react"
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [ordersRes, clientsRes, inventoryRes, vehiclesRes] = await Promise.all([
                    axios.get("http://localhost:8800/orders"),
                    axios.get("http://localhost:8800/clients"),
                    axios.get("http://localhost:8800/inventory"),
                    axios.get("http://localhost:8800/vehicles"),
                ]);
                console.log("Fetched orders:", ordersRes.data);
                console.log("Fetched clients:", clientsRes.data);
                console.log("Fetched inventory:", inventoryRes.data);
                console.log("Fetched vehicles:", vehiclesRes.data);
                setOrders(ordersRes.data);
                setClients(clientsRes.data);
                setInventory(inventoryRes.data);
                setVehicles(vehiclesRes.data);
                setError(null);
            } catch (err) {
                setError(err.res?.data?.error || "Failed to fetch orders");
                console.error("AxiosError:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    

    // Map client_id to client first name
    const getClientFirstName = (client_id) => {
        const client = clients.find((c) => c.idclients === client_id);
        return client ? client.first_name : "Unknown";
    };

    // Map client_id to client last name
    const getClientLastName = (client_id) => {
        const client = clients.find((c) => c.idclients === client_id);
        return client ? client.last_name : "Unknown";
    };

    // Map inventory_id to vehicle brand
    const getVehicleBrand = (inventory_id) => {
        const item = inventory.find((i) => i.idinventory === inventory_id);
        if (!item) return "Unknown";
        const vehicle = vehicles.find((v) => v.idvehicles === item.vehicle_id);
        return vehicle ? vehicle.brand : "Unknown";
    };

    // Map inventory_id to vehicle model
    const getVehicleModel = (inventory_id) => {
        const item = inventory.find((i) => i.idinventory === inventory_id);
        if (!item) return "Unknown";
        const vehicle = vehicles.find((v) => v.idvehicles === item.vehicle_id);
        return vehicle ? vehicle.model : "Unknown";
    };

    return (
        <div className="home">
            <div className="elements-grid">
                {orders.map((order) => (
                    <div key={order.id} className="element">
                        <div className="grid-container">
                            <div className="grid-item">{getClientFirstName(order.client_id)}</div>       
                            <div className="grid-item">{getClientLastName(order.client_id)}</div>
                            <div className="grid-item">{getVehicleBrand(order.inventory_id)}</div>
                            <div className="grid-item">{getVehicleModel(order.inventory_id)}</div>
                        </div>
                        <div className="details">
                            <div className="detail-item">{order.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home