import React from "react";
import "./App.css";
import ChatBot from "./components/chatbot.jsx";

function App() {
  return (
    <div className="home-page">
      <h1 className="app-title">Welcome to NourishLU 🥗</h1>

      <p className="app-description">
        NourishLU helps Lehigh students make smarter dining choices. Track your balances and stay on top of your nutrition.
      </p>

      <p className="app-description">
        You can also tell our chatbot your dietary goals and it’ll suggest the <strong>top 3 dining halls</strong> that best match your needs.
      </p>

      <div classname = "chatbot">
            <ChatBot />
      </div>
    
    </div>

    

  );
}

export default App;
