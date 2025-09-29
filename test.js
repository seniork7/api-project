const axios = require("axios");

async function testAPI() {
    try {
        const res = await axios.get(process.env.API_LINK);
        console.log("Data from API:", res.data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

setTimeout(testAPI, 2000);
