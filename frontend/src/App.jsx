import React from "react";
import "./App.css";
import ChatBot from "./components/chatbot.jsx";
import PieChart from "./components/piechart.jsx";

function App() {
  return (
    <div className="home-page">
      <h1 className="app-title">Welcome to NourishLU 🥗</h1>

      <p className="app-description">
        NourishLU helps Lehigh students make smarter dining choices. View real-time campus dining menus, track your balances, and stay on top of your nutrition.
      </p>

      <p className="app-description">
        Snap a photo of your meal and our AI estimates calories and nutrients. You can also tell our chatbot your dietary goals and it’ll suggest the <strong>top 3 dining halls</strong> that best match your needs.
      </p>

      <div classname = "chatbot">
            <ChatBot />
      </div>

      <div className="piechart-nutrition-calculator">
            <PieChart />
      </div>
    
    </div> 

  );
}

export default App;
