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
      <div className="logo">
        <img src="/logo.png"></img>
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            {/* <span className="icon">🏠</span> */}
            <img src="/homeicon.png" alt="home" className="home-icon" />
            <span className="label">Home</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dining" className={({ isActive }) => (isActive ? "active" : "")}>
            {/* <span className="icon">📅</span> */}
            <img src="/mealpickericon.png" alt="meal" className="meal-picker" />
            <span className="label">Dining Services</span>
          </NavLink>
        </li>

      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <img src="/logoutIcon.png" alt="Logout" className="logout-icon" />
          <span className="label">Logout</span>
        </button>
      </div>
    </div>
  );
}
