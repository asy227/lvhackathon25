import React from "react";
import "./App.css";
import ChatBot from "./components/chatbot.jsx";
import PieChart from "./components/piechart.jsx";

function App() {
  return (
    <div className="home-page">
      <h1 className="app-title">Welcome to <span className="highlight">NourishLU 🥗</span></h1>

      <p className="app-description">
        <strong>NourishLU</strong> is your personal <em>campus dining companion</em> — built for Lehigh students 
        who want to eat well, feel good, and make smarter choices every day. 
        Finding something good to eat shouldn't feel like a guessing game, and now it doesn't have to.
      </p>

      <p className="app-description">
        Explore <strong>real meals</strong> from across campus, discover <strong>nutrition insights</strong> that fit your goals, 
        and chat with our friendly assistant for <em>personalized meal recommendations</em>. 
        Whether you're tracking your protein, exploring vegetarian options, or simply trying to eat better between classes,
        <strong> NourishLU</strong> helps you find what truly works for you.
      </p>

      <p className="app-description final-line">
        <strong>Eat smarter. Feel better. </strong>  
        Enjoy campus life with a little extra flavor — powered by <span className="highlight">NourishLU.</span>
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