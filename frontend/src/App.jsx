import React from "react";
import "./App.css";

function App() {
  return (
    <div className="home-page">
      <h1 className="app-title">Welcome to NourishLU 🥗</h1>

      <p className="app-description">
        NourishLU helps Lehigh students make smarter dining choices. View real-time campus dining menus, track your balances, and stay on top of your nutrition.
      </p>

      <p className="app-description">
        Snap a photo of your meal and our AI estimates calories and nutrients. You can also tell our chatbot your dietary goals — it’ll suggest the <strong>top 3 dining halls</strong> that best match your needs.
      </p>

      <p className="app-note">🍽 Eat smart. 🌱 Stay healthy. 🦅 Go Lehigh.</p>

      <div classname = "chatbot">
            <ChatBot />
      </div>
    
    </div>

    

  );
}

export default App;
