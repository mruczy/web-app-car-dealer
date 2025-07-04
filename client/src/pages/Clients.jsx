import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Clients = () => {
    const [clients,setClients] = useState([])
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const fecthAllClients = async ()=>{
            setLoading(true);
            try{
                const res = await axios.get("http://localhost:8800/clients");
                console.log("Fetched clients:", res.data); // Debug log
                setClients(res.data);
                setError(null);
            }catch(err){
                setError(err.response?.data?.error || "Failed to fetch clients");
                console.error("AxiosError:", err);
            } finally {
                setLoading(false);
            }
        };
        fecthAllClients()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8800/clients/${id}`);
            setClients(clients.filter((client) => client.idclients !== id));
            window.location.reload()
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="home">
            <h1>Clients</h1>
            {error && <div className="error">{error}</div>}
            <button onClick={() => navigate("/clients/add")} disabled={loading}>
                Add New Client
            </button>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.idclients}>
                                <td>{client.first_name}</td>
                                <td>{client.last_name}</td>
                                <td>{client.email || "-"}</td>
                                <td>{client.phone || "-"}</td>
                                <td>{client.adress || "-"}</td>
                                <td>
                                    <Link to={`/clients/edit/${client.idclients}`}>Edit</Link>
                                    <button
                                        onClick={() => handleDelete(client.idclients)}
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

export default Clients