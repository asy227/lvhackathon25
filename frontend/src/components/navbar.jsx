import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="logo">LOGO</div>
      <ul className="sidebar-menu">
        <li>
          <a href="#">
            <span className="icon">🏠</span>
            <span className="label">Home</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon">📅</span>
            <span className="label">Dining Services</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon">👥</span>
            <span className="label">Team</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon">📝</span>
            <span className="label">Register</span>
          </a>
        </li>
      </ul>

        
      <div className="sidebar-footer">
      <button className="logout-btn">
        <img src="./logoutIcon.png" alt="Logout" className="logout-icon" />
        <span className="label">Logout</span>
      </button>
    </div>
    </div>
  );
}
