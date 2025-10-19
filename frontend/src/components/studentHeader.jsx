import React, { useState, useEffect } from "react";
import "./studentHeader.css";

function StudentHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    mealSwipes: 0,
    diningDollars: 0,
    clutchCash: 0,
  });

  useEffect(() => {
    setStudentInfo({
      mealSwipes: 25,
      diningDollars: 40.75,
      clutchCash: 10.5,
    });
  }, []);

  return (
    <div className="student-header">
      <div className="student-header-left">
        <img src="profile.webp" alt="Profile" className="profile-icon" />
        <h2>Hi, FName LName!</h2>
      </div>

      <div
  className="student-header-right-wrapper"
  onMouseEnter={() => setShowDropdown(true)}
  onMouseLeave={() => setShowDropdown(false)}
>
  <div className="student-header-right">
    <img src="./campuscard.jpg" alt="Campus Card" className="campus-card-img" />
    <span className="campus-card-label">Your Campus Card</span>
  </div>

  {showDropdown && (
    <div className="campus-dropdown">
      <h2 className="rethink-sans">
        Meal Swipes: <span style={{ color: "#376713", fontWeight: "600" }}>{studentInfo.mealSwipes}</span>
      </h2>
      <h2>
        Dining Dollars: <span style={{ color: "#376713", fontWeight: "600" }}>${studentInfo.diningDollars.toFixed(2)}</span>
      </h2>
      <h2>
        Clutch Cash: <span style={{ color: "#376713", fontWeight: "600" }}>${studentInfo.clutchCash.toFixed(2)}</span>
      </h2>
    </div>
  )}
</div>

    </div>
  );
}

export default StudentHeader;
