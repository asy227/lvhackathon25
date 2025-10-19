import React, { useState } from "react";
import NavBar from "../components/navbar";
import StudentHeader from "../components/studentHeader";
import "./TestStudentHeader.css";

function TestStudentHeader() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`test-layout ${isExpanded ? "expanded" : ""}`}>
      {/* NavBar */}
      <NavBar onToggle={setIsExpanded} />

      {/* Header */}
      <StudentHeader />

      {/* Dummy content */}
      <div className="test-content">
        <h1>Testing Student Header Component</h1>
        <p>If the NavBar expands, the header should shift smoothly.</p>
      </div>
    </div>
  );
}

export default TestStudentHeader;
