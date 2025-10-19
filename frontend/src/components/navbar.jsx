import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar({ onExpandChange }) {
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = () => {
    setExpanded(true);
    onExpandChange?.(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
    onExpandChange?.(false);
  };

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo Section */}
      <div className="logo">
        <img src="/logo.png" alt="NourishLU Logo" className="logo-icon" />
      </div>

      {/* Sidebar Navigation Links */}
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <img src="/homeicon.png" alt="Home" className="home-icon" />
            <span className="label">Home</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dining"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <img
              src="/mealpickericon.png"
              alt="Dining Services"
              className="meal-picker"
            />
            <span className="label">Dining Services</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}