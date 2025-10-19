import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './piechart.css';

const PieChartComponent = () => {
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generate dropdown options
    const generateOptions = (start, end, unit = '') => {
        const options = [];
        for (let i = start; i <= end; i++) {
            options.push(<option key={i} value={i}>{i}{unit}</option>);
        }
        return options;
    };

    // Fetch nutrient goals from backend
    const fetchNutrientGoals = async (userData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:3000/api/calculate-nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Map backend response to frontend state
            setNutrientGoals({
                calories: data.kcal,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat
            });
            
        } catch (error) {
            console.error('Error fetching nutrient goals:', error);
            setError('Failed to connect to backend. Using default values.');
            // You can keep the current values or set some fallbacks
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        const newData = { 
            ...userData, 
            [field]: value 
        };
        setUserData(newData);
        
        // Call backend API with new data
        fetchNutrientGoals(newData);
    };

    // Fetch initial data when component mounts
    useEffect(() => {
        fetchNutrientGoals(userData);
    }, []);

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
            {/* Error Message */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Compact Input Section */}
            <div className="compact-input-section">
                <div className="input-row">
                    <div className="input-group compact">
                        <label>Gender</label>
                        <select 
                            value={userData.gender} 
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={loading}
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
                            disabled={loading}
                        >
                            {generateOptions(40, 200, ' kg')}
                        </select>
                    </div>

                    <div className="input-group compact">
                        <label>Height</label>
                        <select 
                            value={userData.height}
                            onChange={(e) => handleInputChange('height', e.target.value)}
                            disabled={loading}
                        >
                            {generateOptions(140, 220, ' cm')}
                        </select>
                    </div>

                    <div className="input-group compact">
                        <label>Activity Level</label>
                        <select 
                            value={userData.activityLevel} 
                            onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                            disabled={loading}
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
                <h3>
                    {loading ? 'Calculating...' : 'Your daily recommended nutrition goals:'}
                </h3>
                
                <div className="goals-grid">
                    <div className="goal-card">
                        <div className="goal-value">
                            {loading ? '...' : nutrientGoals.calories}
                        </div>
                        <div className="goal-label">kcal</div>
                    </div>
                    <div className="goal-card">
                        <div className="goal-value">
                            {loading ? '...' : `${nutrientGoals.fat}g`}
                        </div>
                        <div className="goal-label">Fat</div>
                    </div>
                    <div className="goal-card">
                        <div className="goal-value">
                            {loading ? '...' : `${nutrientGoals.protein}g`}
                        </div>
                        <div className="goal-label">Protein</div>
                    </div>
                    <div className="goal-card">
                        <div className="goal-value">
                            {loading ? '...' : `${nutrientGoals.carbs}g`}
                        </div>
                        <div className="goal-label">Carb</div>
                    </div>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="compact-piechart">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={loading ? [] : pieData} // Empty array when loading
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
                {loading && (
                    <div className="piechart-loading">
                        Updating chart...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PieChartComponent;