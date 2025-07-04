import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InventoryAdd = () => {
    const [inventory, setInventory] = useState({
        vehicle_id: "",
        vin: "",
        location: "Magazyn A",
        purchase_price: "",
    });
    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8800/vehicles");
                console.log("Fetched vehicles:", res.data); // Debug log
                setVehicles(res.data);
                setErrors({});
            } catch (err) {
                setErrors({ fetch: err.response?.data?.error || "Failed to fetch vehicles" });
                console.error("AxiosError:", err);
            } finally {
                setLoading(false);
            }
        };
    fetchData();
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!inventory.vehicle_id) {
            newErrors.vehicle_id = "Vehicle is required";
        } else if (isNaN(inventory.vehicle_id) || !vehicles.find((v) => v.idvehicles === parseInt(inventory.vehicle_id))) {
            newErrors.vehicle_id = "Invalid vehicle selected";
        }

        if (!inventory.vin) {
            newErrors.vin = "VIN is required";
        } else if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(inventory.vin)) {
            newErrors.vin = "VIN must be a 17-character string with letters A-H, J-N, P, R-Z, and numbers";
        }

        if (!["Magazyn A", "Magazyn B"].includes(inventory.location)) {
            newErrors.location = "Location must be Magazyn A or Magazyn B";
        }

        if (!inventory.purchase_price) {
            newErrors.purchase_price = "Purchase price is required";
        } else if (isNaN(inventory.purchase_price) || inventory.purchase_price < 0 || inventory.purchase_price > 9999999999.99) {
            newErrors.purchase_price = "Purchase price must be a non-negative number (max $9,999,999,999.99)";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("handleChange:", name, value); // Debug log
        setInventory({ ...inventory, [name]: value });
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
            await axios.post("http://localhost:8800/inventory", {
                vehicle_id: parseInt(inventory.vehicle_id),
                vin: inventory.vin,
                location: inventory.location,
                purchase_price: parseFloat(inventory.purchase_price),
            });
            navigate("/inventory");
        } catch (err) {
            setErrors({ submit: err.response?.data?.error || "Failed to add inventory item" });
            console.error("AxiosError:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <h1>Add Inventory Item</h1>
            {errors.submit && <div className="error">{errors.submit}</div>}
            {errors.fetch && <div className="error">{errors.fetch}</div>}
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Adding..." : "Add"}
            </button>
            <button
                type="button"
                onClick={() => navigate("/inventory")}
                disabled={loading}
            >
                Cancel
            </button>
            <div className="elements-inline">
                <form>
                    <div>
                        <label>Vehicle:</label>
                        <select
                            name="vehicle_id"
                            value={inventory.vehicle_id}
                            onChange={handleChange}
                            disabled={loading || vehicles.length === 0}
                        >
                        <option value="">Select a vehicle</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.idvehicles} value={vehicle.idvehicles}>
                            {vehicle.brand} {vehicle.model} ({vehicle.year})
                            </option>
                        ))}
                        </select>
                        {errors.vehicle_id && <div className="error">{errors.vehicle_id}</div>}
                        <label>VIN:</label>
                        <input
                            type="text"
                            placeholder="VIN"
                            name="vin"
                            value={inventory.vin}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.vin && <div className="error">{errors.vin}</div>}
                        <label>Location:</label>
                        <select
                            name="location"
                            value={inventory.location}
                            onChange={handleChange}
                            disabled={loading}
                        >
                        <option value="Magazyn A">Magazyn A</option>
                        <option value="Magazyn B">Magazyn B</option>
                        </select>
                        {errors.location && <div className="error">{errors.location}</div>}
                        <label>Purchase Price:</label>
                        <input
                            type="number"
                            placeholder="Purchase Price"
                            name="purchase_price"
                            value={inventory.purchase_price}
                            onChange={handleChange}
                            disabled={loading}
                            step="0.01"
                            min="0"
                        />
                        {errors.purchase_price && <div className="error">{errors.purchase_price}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryAdd;