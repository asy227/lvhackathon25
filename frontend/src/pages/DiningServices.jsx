import React, { useState, useEffect } from "react";
import "./DiningServices.css";

export default function DiningServices() {
  const [showGoals, setShowGoals] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reqBody, setReqBody] = useState({});

  const dietaryGoals = [
    "High Protein",
    "Low Protein",
    "Vegetarian",
    "Vegan",
    "Low Cost",
    "High Cost",
    "Low Carb",
    "High Carb",
  ];

  // Whenever selectedGoals changes, rebuild the request body
  useEffect(() => {
    const newReqBody = {
      goals: selectedGoals,
      user_id: 1, // optional: replace with actual logged-in user id if available
    };
    setReqBody(newReqBody);
  }, [selectedGoals]);

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const selectAll = () => setSelectedGoals(dietaryGoals);
  const deselectAll = () => setSelectedGoals([]);

  // Main fetch function
  const handleShowRecommendations = async () => {
    try {
      const response = await fetch("/api/recommend-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.suggested_meals || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setRecommendations([]);
    }
  };

  return (
    <div className="dining-page">
      {/* LEFT SIDE: Controls */}
      <div className="dining-left">
        <h1 className="dining-title">Dining Services</h1>

        {/* Dietary Goals Dropdown */}
        <div className="goals-section">
          <button
            className="goals-dropdown-btn"
            onClick={() => setShowGoals(!showGoals)}
          >
            Dietary Goals {showGoals ? "▲" : "▼"}
          </button>

          {showGoals && (
            <div className="goals-dropdown">
              <p className="goal-toggle-text select-all" onClick={selectAll}>
                Select All
              </p>
              <p className="goal-toggle-text deselect-all" onClick={deselectAll}>
                Deselect All
              </p>

              {dietaryGoals.map((goal) => (
                <label key={goal} className="goal-option">
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal)}
                    onChange={() => toggleGoal(goal)}
                  />
                  {goal}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Generate Recommendations */}
        <button
          className="show-recommendations-btn"
          onClick={handleShowRecommendations}
        >
          Show Top 5 Choices
        </button>
      </div>

      {/* RIGHT SIDE: Recommendations */}
      <div className="recommendations-section">
        <h2 className="menu-title">Top 5 Dining Options</h2>
        {recommendations.length === 0 ? (
          <p className="placeholder-text">
            Select your dietary goals and click “Show Top 5 Choices” to see
            recommendations tailored for you.
          </p>
        ) : (
          <ul className="recommendations-list">
            {recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">
                {rec.meal_name
                  ? `${rec.location} — ${rec.meal_name}`
                  : rec}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}