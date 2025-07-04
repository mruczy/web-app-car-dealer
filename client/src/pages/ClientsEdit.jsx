import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams} from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom";


const ClientsEdit = () => {
    const [client, setClient] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        adress: "",
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const idclients = location.pathname.split("/")[3];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClient = async ()=> {
            if (!idclients || isNaN(idclients)) {
                setErrors({fetch : "Invalid client ID"});
                return;
            }
            setLoading(true);
            try{
                const res = await axios.get(`http://localhost:8800/clients/${idclients}`);
                console.log("Fetched client data:", res.data);
                setClient(res.data[0] || {
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    adress: "",
                });
                setErrors({});
            }catch(err){
                setErrors(err.response?.data?.error || "Failed to fetch client");
                console.error("AxiosError:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [idclients]);

    const validate = () => {
        const newErrors = {};

        // First name: required, letters and spaces, max 255 chars
        if (!client.first_name) {
            newErrors.first_name = "First name is required";
        } else if (!/^[A-Za-z\s]{1,255}$/.test(client.first_name)) {
            newErrors.first_name = "First name must contain only letters and spaces (max 255 characters)";
        }

        // Last name: required, letters and spaces, max 255 chars
        if (!client.last_name) {
            newErrors.last_name = "Last name is required";
        } else if (!/^[A-Za-z\s]{1,255}$/.test(client.last_name)) {
            newErrors.last_name = "First name must contain only letters and spaces (max 255 characters)";
        }

        // Email: optional, valid email format, max 255 chars
        if (!client.email) {
            newErrors.email = "Email is required";
        }else if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
            newErrors.email = "Invalid email format";
        } else if (client.email.length > 255) {
            newErrors.email = "Email must be at most 255 characters";
        }

        // Phone: optional, digits and optional dashes, max 20 chars
        if (!client.phone) {
            newErrors.phone = "Phone is required";
        } else if (client.phone && !/^\d[\d-]{0,18}\d$/.test(client.phone)) {
            newErrors.phone = "Phone must contain only digits and dashes (e.g., 123-456-7890)";
        } else if (client.phone.length > 20) {
            newErrors.phone = "Phone must be at most 20 characters";
        }

        // Address: optional, max 255 chars
        if (!client.adress) {

        } else if (client.adress.length > 255) {
            newErrors.adress = "Address must be at most 255 characters";
        }
        return newErrors;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("handleChange:", name, value); // Debug log
        setClient({ ...client, [name]: value });
        // Clear error for this field on change
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
            await axios.put(`http://localhost:8800/clients/${idclients}`, client);
            navigate("/clients");
        } catch (err) {
            setErrors(err.response?.data?.error || "Failed to update client");
            console.error("AxiosError:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <h1>Update Client</h1>
            {errors.submit && <div className="error">{errors.submit}</div>}
            {errors.fetch && <div className="error">{errors.fetch}</div>}
            <button onClick={handleClick} disabled={loading}>
                {loading ? "Updating..." : "Update"}
            </button>
            <button
                type="button"
                onClick={() => navigate("/clients")}
                disabled={loading}
            >
                Cancel
            </button>
            <div className="elements-inline">
                <form>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            placeholder="first name"
                            name="first_name"
                            value={client.first_name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.first_name && <div className="error">{errors.first_name}</div>}
                        <label>Last Name:</label>
                        <input
                            type="text"
                            placeholder="last name"
                            name="last_name"
                            value={client.last_name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.last_name && <div className="error">{errors.last_name}</div>}
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="email"
                            name="email"
                            value={client.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                        <label>Phone:</label>
                        <input
                            type="tel"
                            placeholder="phone"
                            name="phone"
                            value={client.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.phone && <div className="error">{errors.phone}</div>}
                        <label>Adress:</label>
                        <input
                            type="text"
                            placeholder="address"
                            name="adress"
                            value={client.adress}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.adress && <div className="error">{errors.adress}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClientsEdit