import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './piechart.css';

const piechart = () => {
    const [userData, setUserData] = useState({
        gender: 'male',
        age: '25',
        weight: '70', // kg
        height: '170', // cm
        activityLevel: 'moderate'
    });

    const [nutrientGoals, setNutrientGoals] = useState({
        calories: 2000,
        protein: 50,
        carbs: 250,
        fat: 67
    });

    // Generate dropdown options
    const generateOptions = (start, end, unit = '') => {
        const options = [];
        for (let i = start; i <= end; i++) {
            options.push(<option key={i} value={i}>{i}{unit}</option>);
        }
        return options;
    };

    // Calculate nutrient goals
    const calculateNutrientGoals = (data) => {
        const weight = parseInt(data.weight);
        const height = parseInt(data.height);
        const age = parseInt(data.age);

        // Basal Metabolic Rate (BMR)
        let bmr;
        if (data.gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Activity level multipliers
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        const tdee = bmr * activityMultipliers[data.activityLevel];
        const calories = Math.round(tdee);
        const proteinGrams = Math.round((calories * 0.25) / 4);
        const fatGrams = Math.round((calories * 0.30) / 9);
        const carbGrams = Math.round((calories * 0.45) / 4);

        return { calories, protein: proteinGrams, carbs: carbGrams, fat: fatGrams };
    };

    const handleInputChange = (field, value) => {
        const newData = { ...userData, [field]: value };
        setUserData(newData);
        const newGoals = calculateNutrientGoals(newData);
        setNutrientGoals(newGoals);
    };

    // Data for pie chart
    const pieData = [
        { name: 'Protein', value: nutrientGoals.protein, color: '#8884d8' },
        { name: 'Carbs', value: nutrientGoals.carbs, color: '#82ca9d' },
        { name: 'Fat', value: nutrientGoals.fat, color: '#ffc658' }
    ];

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
        <div className="piechart-container compact">
            {/* Compact Input Section */}
            <div className="compact-input-section">
                <div className="input-row">
                    <div className="input-group compact">
                        <label>Gender</label>
                        <select 
                            value={userData.gender} 
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="input-group compact">
                        <label>Weight</label>
                        <select 
                            value={userData.weight}
                            onChange={(e) => handleInputChange('weight', e.target.value)}
                        >
                            {generateOptions(40, 200, ' kg')}
                        </select>
                    </div>

                    <div className="input-group compact">
                        <label>Height</label>
                        <select 
                            value={userData.height}
                            onChange={(e) => handleInputChange('height', e.target.value)}
                        >
                            {generateOptions(140, 220, ' cm')}
                        </select>
                    </div>

                    <div className="input-group compact">
                        <label>Activity Level</label>
                        <select 
                            value={userData.activityLevel} 
                            onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                        >
                            <option value="sedentary">Sedentary</option>
                            <option value="light">Light</option>
                            <option value="moderate">Moderate</option>
                            <option value="active">Active</option>
                            <option value="very_active">Very Active</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="compact-results">
                <h3>Your daily recommended nutrition goals:</h3>
                
                <div className="goals-grid">
                    <div className="goal-card">
                        <div className="goal-value">{nutrientGoals.calories}</div>
                        <div className="goal-label">kcal</div>
                    </div>
                    <div className="goal-card">
                        <div className="goal-value">{nutrientGoals.fat}g</div>
                        <div className="goal-label">Fat</div>
                    </div>
                    <div className="goal-card">
                        <div className="goal-value">{nutrientGoals.protein}g</div>
                        <div className="goal-label">Protein</div>
                    </div>
                    <div className="goal-card">
                        <div className="goal-value">{nutrientGoals.carbs}g</div>
                        <div className="goal-label">Carb</div>
                    </div>
                </div>
            </div>

            {/* Pie Chart - More Compact */}
            <div className="compact-piechart">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={60}
                            innerRadius={30}
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

export default piechart;