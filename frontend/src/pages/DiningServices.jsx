import React, { useState, useEffect } from "react";
import "./DiningServices.css";

const diningLocations = [
  { name: "Rathbone Dining Hall", url: "https://lehigh.sodexomyway.com/en-us/locations/rathbone-dining-hall" },
  { name: "The Grind @ FML", url: "https://lehigh.sodexomyway.com/en-us/locations/thegrind" },
  { name: "Upper Court", url: "https://lehigh.sodexomyway.com/en-us/locations/uppercourt" },
  { name: "The Cup", url: "https://lehigh.sodexomyway.com/en-us/locations/thecup" },
];

export default function DiningServices() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [menu, setMenu] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);

  // Mock menu data (can be replaced later with API data)
  useEffect(() => {
    if (selectedLocation) {
      setMenu([
        { item: "Grilled Chicken Sandwich", calories: 350, protein: 25, fat: 8 },
        { item: "Garden Salad", calories: 120, protein: 4, fat: 2 },
        { item: "Fruit Cup", calories: 90, protein: 1, fat: 0 },
      ]);
    }
  }, [selectedLocation]);

  return (
    <div className="dining-page">
      <h1 className="dining-title">Dining Services</h1>

      {/* Dining location buttons */}
      <div className="dining-locations">
        {diningLocations.map((loc) => (
          <button
            key={loc.name}
            onClick={() => setSelectedLocation(loc.name)}
            className={`location-btn ${selectedLocation === loc.name ? "active" : ""}`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Menu for selected location */}
      {selectedLocation && (
        <div className="menu-section">
          <h2 className="menu-title">Menu for {selectedLocation}</h2>
          <ul className="menu-list">
            {menu.map((m) => (
              <li key={m.item}>
                <strong>{m.item}</strong> — {m.calories} cal, {m.protein}g protein, {m.fat}g fat
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nutrition Calculator */}
      <div className="calculator-section">
        <button
          className="toggle-calculator-btn"
          onClick={() => setShowCalculator(!showCalculator)}
        >
          {showCalculator ? "Hide Nutrition Calculator" : "Show Nutrition Calculator"}
        </button>

        {showCalculator && (
          <div className="nutrition-calculator">
            <h2 className="calculator-title">Nutrition Calculator</h2>
            <p className="calculator-subtext">
              Enter your meal details to estimate total nutrition.
            </p>
            <NutritionCalculator />
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for the calculator
function NutritionCalculator() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");

  const total = Number(calories) + Number(protein) * 4 + Number(fat) * 9;

  return (
    <div className="calculator">
      <label>
        Calories:
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
      </label>
      <label>
        Protein (g):
        <input
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
        />
      </label>
      <label>
        Fat (g):
        <input
          type="number"
          value={fat}
          onChange={(e) => setFat(e.target.value)}
        />
      </label>

      <p className="summary">Estimated Total: {total || 0} kcal</p>
    </div>
  );
}
