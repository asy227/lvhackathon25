const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser for most use cases

// Example test route
app.get('/', (req, res) => {
  res.send('<h1>NourishLU Backend Running</h1>');
});

// Sample API route
app.get('/api/meals', (req, res) => {
  res.json([
    { id: 1, name: "Grilled Chicken Bowl", location: "Rathbone", calories: 450 },
    { id: 2, name: "Veggie Wrap", location: "Brodhead", calories: 350 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});