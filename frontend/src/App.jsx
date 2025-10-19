import React from "react";
import "./App.css";

// Import your components
import NavBar from "./components/navbar.jsx";
import StudentHeader from "./components/studentHeader.jsx";

function App() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <NavBar />

      {/* Top header */}
      <StudentHeader />

      {/* Main content area */}
      <main
        style={{
          marginLeft: "100px", // aligns with collapsed sidebar width
          marginTop: "100px", // space below StudentHeader
          padding: "1rem",
          color: "white",
        }}
      >
        <h1>Welcome to MyApp</h1>
        <p>This is your main content area.</p>
        <p>Hover over the sidebar to expand it!</p>
      </main>
    </div>
  );
}

export default App;
