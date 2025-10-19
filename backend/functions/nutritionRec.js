// functions/nutritionRec.js

function calculateNutrition({ gender, height_cm, weight_kg, age, activity_level, goal }) {
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'female') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  }

  const activityMultipliers = {
    low: 1.2,
    moderate: 1.55,
    high: 1.725,
  };

  // Adjust BMR for activity level
  let calories = bmr * (activityMultipliers[activity_level] || 1.2);

  // Adjust for goal
  if (goal === 'lose') calories -= 500;
  if (goal === 'gain') calories += 300;

  // Macronutrient breakdown
  const carbs = (calories * 0.4) / 4;
  const protein = (calories * 0.3) / 4;
  const fat = (calories * 0.3) / 9;

  return {
    calories: Math.round(calories),
    carbs: Math.round(carbs),
    protein: Math.round(protein),
    fat: Math.round(fat),
  };
}

module.exports = { calculateNutrition };
