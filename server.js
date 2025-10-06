/*Import required modules*/
// Import express module to create server
const express = require('express');
// Import cors module so users access the API
const cors = require('cors');
// Import fs module to read files to read products data
const fs = require('fs');
// Import products data from JSON file
const products = require('./products.json');
// Import path module to handle file paths
const path = require('path');
// Import and configure dotenv to manage environment variables
require('dotenv').config();

// Initialize express app
const app = express();

/* Middleware */
// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'images' directory
app.use(express.static(path.join(__dirname, 'images')));

// Serve the API documentation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './api-docs.html'));
});

// Get products
app.get('/api/products', (req, res) => {
    // Get destructure query parameters
    const { category, name, id } = req.query;

    /* Filter products based on query parameters*/
    // Get all products
    let data = products;

    if (id) {
        data = data.filter(p => p.id === parseInt(id, 10));
    }

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
