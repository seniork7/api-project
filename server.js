/*Import required modules*/
// Import express module to create server
const express = require('express');
// Import cors module so users access the API
const cors = require('cors');
// Import fs module to read files to read products data
const fs = require('fs');
// Import products data from JSON file
const products = require('./products.json');
// Import and configure dotenv to manage environment variables
require('dotenv').config();

// Initialize express app
const app = express();

/* Middleware */
// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the AllMart Grocery Store API!');
});

// Get products
app.get('/api/products', (req, res) => {
    // Get destructure query parameters
    const { category, name } = req.query;

    /* Filter products based on query parameters*/
    // Get all products
    let data = products;

    // Filter by category
    if (category) {
        data = data.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by name
    if (name) {
        data = data.filter(p => p.name.toLowerCase() === name.toLowerCase());
    }

    // Check if data array has products
    if (data.length > 0) {
        // Return the filtered products
        res.json(data);
    } else {
        // Return a 404 error if no products found
        res.status(404).json({ error: 'No products found.' });
    }
});

// Start the server
const port = process.env.PORT || 3000;

// Listen for incoming requests
app.listen(port, () => console.log(`Server is running at port ${port}`));
