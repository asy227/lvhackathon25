import React, { useState } from "react";
import "./DiningServices.css";

export default function DiningServices() {
  const [showGoals, setShowGoals] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

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

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const selectAll = () => {
    setSelectedGoals(dietaryGoals);
  };

  const deselectAll = () => {
    setSelectedGoals([]);
  };

  const handleShowRecommendations = () => {
    // Placeholder mock data (backend connection later)
    setRecommendations([
      "Rathbone Dining Hall — Grilled Chicken Bowl",
      "The Grind @ FML — Protein Smoothie",
      "University Center — Leaf & Ladle Salad",
      "The Health @ UC — Quinoa Power Bowl",
      "Common Grounds — Oatmeal & Fruit Bar",
    ]);
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
                {rec}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
