import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

const VehiclesAdd = () => {
    const [vehicle, setVehicle] = useState({
        brand: "",
        model: "",
        engine: "",
        year: "",
        body_type: "",
        color: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!vehicle.brand) {
            newErrors.brand = "Brand is required";
        } else if (!/^[A-Za-z\s]{1,50}$/.test(vehicle.brand)) {
            newErrors.brand = "Brand must contain only letters and spaces (max 50 characters)";
        }

        if (!vehicle.model) {
            newErrors.model = "Model is required";
        } else if (!/^[A-Za-z0-9\s]{1,50}$/.test(vehicle.model)) {
            newErrors.model = "Model must contain only letters, numbers, and spaces (max 50 characters)";
        }

        if (!vehicle.engine) {
            newErrors.engine = "Engine is required";
        } else if (!/^[A-Za-z0-9\s.]{1,50}$/.test(vehicle.engine)) {
            newErrors.engine = "Engine must contain only letters, numbers, spaces, and dots (max 50 characters)";
        }

        if (!vehicle.year) {
            newErrors.year = "Year is required";
        } else if (!Number.isInteger(Number(vehicle.year)) || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
            newErrors.year = `Year must be an integer between 1900 and ${new Date().getFullYear() + 1}`;
        }

        if (!vehicle.body_type) {
            newErrors.body_type = "Body type is required";
        } else if (!/^[A-Za-z\s]{1,50}$/.test(vehicle.body_type)) {
            newErrors.body_type = "Body type must contain only letters and spaces (max 50 characters)";
        }

        if (!vehicle.color) {
            newErrors.color = "Color is required";
        } else if (!/^[A-Za-z\s]{1,50}$/.test(vehicle.color)) {
            newErrors.color = "Color must contain only letters and spaces (max 50 characters)";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("handleChange:", name, value); // Debug log
        setVehicle({ ...vehicle, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            await axios.post("http://localhost:8800/vehicles", vehicle);
            navigate("/vehicles");
        } catch (err) {
            setErrors({ submit: err.response?.data?.error || "Failed to add vehicle" });
            console.error("AxiosError:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="home">
            <h1>Add Vehicle</h1>
            {errors.submit && <div className="error">{errors.submit}</div>}
            <button onClick={handleClick} disabled={loading}>
                {loading ? "Adding..." : "Add"}
            </button>
            <button
                type="button"
                onClick={() => navigate("/vehicles")}
                disabled={loading}
            >
                Cancel
            </button>
            <div className="elements-inline">
                <form>
                    <div>
                        <label>Brand:</label>
                        <input
                            type="text"
                            placeholder="Brand"
                            name="brand"
                            value={vehicle.brand}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.brand && <div className="error">{errors.brand}</div>}
                        <label>Model:</label>
                        <input
                            type="text"
                            placeholder="Model"
                            name="model"
                            value={vehicle.model}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.model && <div className="error">{errors.model}</div>}
                        <label>Engine:</label>
                        <input
                            type="text"
                            placeholder="Engine"
                            name="engine"
                            value={vehicle.engine}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.engine && <div className="error">{errors.engine}</div>}
                        <label>Year:</label>
                        <input
                            type="number"
                            placeholder="Year"
                            name="year"
                            value={vehicle.year}
                            onChange={handleChange}
                            disabled={loading}
                            min="1900"
                            max={new Date().getFullYear() + 1}
                        />
                        {errors.year && <div className="error">{errors.year}</div>}
                        <label>Body Type:</label>
                        <input
                            type="text"
                            placeholder="Body Type"
                            name="body_type"
                            value={vehicle.body_type}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.body_type && <div className="error">{errors.body_type}</div>}
                        <label>Color:</label>
                        <input
                            type="text"
                            placeholder="Color"
                            name="color"
                            value={vehicle.color}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.color && <div className="error">{errors.color}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehiclesAdd