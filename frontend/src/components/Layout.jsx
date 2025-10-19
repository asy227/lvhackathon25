import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./navbar";
import StudentHeader from "./studentHeader";

export default function Layout() {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const isHomePage = location.pathname === "/";

  return (
    <div className={`app-layout ${sidebarExpanded ? "sidebar-expanded" : ""}`}>
      <Navbar onExpandChange={setSidebarExpanded} />
      <div className="main-content">
        {isHomePage && <StudentHeader />}
        <div className="page-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
