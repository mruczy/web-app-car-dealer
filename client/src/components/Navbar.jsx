import React from "react"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container">
                <div className="links">
                    <Link className="link" to="/">
                        Home
                    </Link>
                    <Link className="link" to="/Clients">
                        Clients
                    </Link>
                    <Link className="link" to="/Vehicles">
                        Vehicles
                    </Link>
                    <Link className="link" to="/Inventory">
                        Inventory
                    </Link>
                    <Link className="link" to="/Orders">
                        Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar