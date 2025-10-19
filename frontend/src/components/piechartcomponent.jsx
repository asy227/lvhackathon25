import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './piechart.css';

const PieChartComponent = () => {
    const [userData, setUserData] = useState({
        gender: 'male',
        age: 25,
        weight: 70, // kg
        height: 170, // cm
        activityLevel: 'moderate' // sedentary, light, moderate, active, very_active
    });

    const [nutrientGoals, setNutrientGoals] = useState({
        calories: 2000,
        protein: 50,
        carbs: 250,
        fat: 67
    });

    // Calculate nutrient goals based on user data
    const calculateNutrientGoals = (data) => {
        // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
        let bmr;
        if (data.gender === 'male') {
            bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
        } else {
            bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
        }

        // Activity level multipliers
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        // Total Daily Energy Expenditure (TDEE)
        const tdee = bmr * activityMultipliers[data.activityLevel];

        // Set calorie goal (TDEE for maintenance)
        const calories = Math.round(tdee);

        // Macronutrient distribution (standard ratios)
        const proteinGrams = Math.round((calories * 0.25) / 4); // 25% of calories, 4 cal/g
        const fatGrams = Math.round((calories * 0.30) / 9);     // 30% of calories, 9 cal/g
        const carbGrams = Math.round((calories * 0.45) / 4);    // 45% of calories, 4 cal/g

        return {
            calories,
            protein: proteinGrams,
            carbs: carbGrams,
            fat: fatGrams
        };
    };

    // Data for pie chart
    const pieData = [
        { name: 'Protein', value: nutrientGoals.protein, color: '#8884d8' },
        { name: 'Carbs', value: nutrientGoals.carbs, color: '#82ca9d' },
        { name: 'Fat', value: nutrientGoals.fat, color: '#ffc658' }
    ];

    const handleInputChange = (field, value) => {
        const newData = {
            ...userData,
            [field]: field === 'gender' || field === 'activityLevel' ? value : Number(value)
        };
        setUserData(newData);
        
        // Recalculate goals when user data changes
        const newGoals = calculateNutrientGoals(newData);
        setNutrientGoals(newGoals);
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${data.name} : ${data.value}g`}</p>
                    <p className="desc">{`${Math.round((data.value * (data.name === 'Fat' ? 9 : 4)) / nutrientGoals.calories * 100)}% of calories`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="piechart-container">
            {/* User Input Section */}
            <div className="user-input-section">
                <h3>Calculate Your Daily Needs</h3>
                <div className="input-grid">
                    <div className="input-group">
                        <label>Gender</label>
                        <select 
                            value={userData.gender} 
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Age</label>
                        <input 
                            type="number" 
                            value={userData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            min="18"
                            max="100"
                        />
                    </div>

                    <div className="input-group">
                        <label>Weight (kg)</label>
                        <input 
                            type="number" 
                            value={userData.weight}
                            onChange={(e) => handleInputChange('weight', e.target.value)}
                            min="40"
                            max="200"
                        />
                    </div>

                    <div className="input-group">
                        <label>Height (cm)</label>
                        <input 
                            type="number" 
                            value={userData.height}
                            onChange={(e) => handleInputChange('height', e.target.value)}
                            min="140"
                            max="220"
                        />
                    </div>

                    <div className="input-group">
                        <label>Activity Level</label>
                        <select 
                            value={userData.activityLevel} 
                            onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                        >
                            <option value="sedentary">Sedentary (little exercise)</option>
                            <option value="light">Light (1-3 days/week)</option>
                            <option value="moderate">Moderate (3-5 days/week)</option>
                            <option value="active">Active (6-7 days/week)</option>
                            <option value="very_active">Very Active (2x/day)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="results-summary">
                <h3>Your Daily Nutrition Goals</h3>
                <div className="nutrient-cards">
                    <div className="nutrient-card calories">
                        <h4>Calories</h4>
                        <p>{nutrientGoals.calories} kcal</p>
                    </div>
                    <div className="nutrient-card protein">
                        <h4>Protein</h4>
                        <p>{nutrientGoals.protein}g</p>
                    </div>
                    <div className="nutrient-card carbs">
                        <h4>Carbs</h4>
                        <p>{nutrientGoals.carbs}g</p>
                    </div>
                    <div className="nutrient-card fat">
                        <h4>Fat</h4>
                        <p>{nutrientGoals.fat}g</p>
                    </div>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="piechart-section">
                <h3>Macronutrient Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieChartComponent;