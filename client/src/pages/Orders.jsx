import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
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
                setError(err.response?.data?.error || "Failed to fetch data");
                console.error("AxiosError:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8800/orders/${id}`);
            setOrders(orders.filter((order) => order.idorders !== id));
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete order");
            console.error("AxiosError:", err);
        } finally {
            setLoading(false);
        }
    };

    // Map client_id to client name
    const getClientName = (client_id) => {
        const client = clients.find((c) => c.idclients === client_id);
        return client ? `${client.first_name} ${client.last_name}` : "Unknown";
    };

    // Map inventory_id to vehicle details
    const getVehicleName = (inventory_id) => {
        const item = inventory.find((i) => i.idinventory === inventory_id);
        if (!item) return "Unknown";
        const vehicle = vehicles.find((v) => v.idvehicles === item.vehicle_id);
        return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : "Unknown";
    };

    return (
        <div className="home">
            <h1>Orders</h1>
            {error && <div className="error">{error}</div>}
            <button onClick={() => navigate("/orders/add")} disabled={loading}>
                Add New Order
            </button>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Vehicle</th>
                            <th>Status</th>
                            <th>Order Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.idorders}>
                                <td>{getClientName(order.client_id)}</td>
                                <td>{getVehicleName(order.inventory_id)}</td>
                                <td>{order.status}</td>
                                <td>{order.sale_price}</td>
                                <td>
                                    <Link to={`/orders/edit/${order.idorders}`}>Edit</Link>
                                    <button
                                        onClick={() => handleDelete(order.idorders)}
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Orders;