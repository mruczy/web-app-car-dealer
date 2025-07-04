import React from "react"
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link,useLocation, useNavigate } from "react-router-dom";

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllVehicles = async () => {
            setLoading(true);
            try{
                const res = await axios.get("http://localhost:8800/vehicles");
                console.log("Fetched vehicles:", res.data);
                setVehicles(res.data);
                setError(null);
            }catch(err){
                setError(err.response?.data?.error || "Failed to fetch vehicles");
                console.error("AxiosError:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAllVehicles()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8800/vehicles/${id}`);
            setVehicles(vehicles.filter((vehicle) => vehicle.idvehicles !== id));
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete vehicle");
            console.error("AxiosError:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <h1>Vehicles</h1>
            {error && <div className="error">{error}</div>}
            <button onClick={() => navigate("/vehicles/add")} disabled={loading}>
                Add New Vehicle
            </button>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Engine</th>
                            <th>Year</th>
                            <th>Body Type</th>
                            <th>Color</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.idvehicles}>
                                <td>{vehicle.brand}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.engine}</td>
                                <td>{vehicle.year}</td>
                                <td>{vehicle.body_type}</td>
                                <td>{vehicle.color}</td>
                                <td>
                                    <Link to={`/vehicles/edit/${vehicle.idvehicles}`}>Edit</Link>
                                    <button
                                        onClick={() => handleDelete(vehicle.idvehicles)}
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

export default Vehicles