import React, { useState, useEffect } from "react";
import "./studentHeader.css";
import profileIcon from "../../imgs/profile.webp";
import campusCard from "../../imgs/campuscard.jpg";

function StudentHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    mealSwipes: 0,
    diningDollars: 0,
    clutchCash: 0,
  });

  // For now, mock the data (later you can replace this with an API call)
  useEffect(() => {
    setStudentInfo({
      mealSwipes: 25,
      diningDollars: 40.75,
      clutchCash: 10.50,
    });
  }, []);

  return (
    <div className="student-header">
      <div className="student-header-left">
        <img src={profileIcon} alt="Profile" className="profile-icon" />
        <h2>Hi, FName LName!</h2>
      </div>

      <div
        className="student-header-right"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <img src={campusCard} alt="Campus Card" className="campus-card-img" />
        <span className="campus-card-label">Campus Card</span>

        {showDropdown && (
          <div className="campus-dropdown">
            <p className="rethink-sans">🍽 Meal Swipes: {studentInfo.mealSwipes}</p>
            <p>💳 Dining Dollars: ${studentInfo.diningDollars.toFixed(2)}</p>
            <p>💰 Clutch Cash: ${studentInfo.clutchCash.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentHeader;
