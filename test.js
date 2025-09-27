const axios = require("axios");

async function testAPI() {
    try {
        const res = await axios.get("http://localhost:4000/api/products?category=fruit");
        console.log("Data from API:", res.data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

setTimeout(testAPI, 2000);
