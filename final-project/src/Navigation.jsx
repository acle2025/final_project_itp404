import React from "react";
import { NavLink } from "react-router-dom";
import { faBagShopping, faCompactDisc, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top w-100 bg-white mb-2">
        <div className="container-fluid">
            <NavLink to="/" className="navbar-brand fw-semibold">
                <FontAwesomeIcon icon={faCompactDisc} size="2xl" style={{color: "#292929"}} />
                &nbsp;&nbsp;The Record
            </NavLink>
            <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <NavLink to="/products" className="nav-link">
                            Shop
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/library" className="nav-link">
                            Library
                        </NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto mb-2">
                    <li className="nav-item">
                        <NavLink to="/account" className="nav-link mx-2">
                            <FontAwesomeIcon icon={faUser} size="xl" style={{color: "#292929"}} /> 
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/favorite" className="nav-link mx-2">
                            <FontAwesomeIcon icon={faHeart} size="xl" style={{color: "#292929"}} />
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/cart" className="nav-link mx-2">
                            <FontAwesomeIcon icon={faBagShopping} size="xl" style={{color: "#292929"}} />
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}