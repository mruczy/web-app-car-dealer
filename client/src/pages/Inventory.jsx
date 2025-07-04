import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8800/inventory");
                console.log("Fetched inventory:", response.data); // Debug log
                setInventory(response.data);
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
        if (!window.confirm("Are you sure you want to delete this inventory item?")) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8800/inventory/${id}`);
            setInventory(inventory.filter((item) => item.idinventory !== id));
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete inventory item");
            console.error("AxiosError:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <h1>Inventory</h1>
            {error && <div className="error">{error}</div>}
            <button onClick={() => navigate("/inventory/add")} disabled={loading}>
                Add New Inventory Item
            </button>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>VIN</th>
                            <th>Location</th>
                            <th>Purchase Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.idinventory}>
                                <td>{`${item.brand} ${item.model} (${item.year})`}</td>
                                <td>{item.vin}</td>
                                <td>{item.location}</td>
                                <td>{item.purchase_price}</td>
                                <td>
                                    <Link to={`/inventory/edit/${item.idinventory}`}>Edit</Link>
                                    <button
                                        onClick={() => handleDelete(item.idinventory)}
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

export default Inventory;