import axios from 'axios';
import { API_LINK } from "./config.js";

async function testAPI() {
    try {
        const res = await axios.get(`${API_LINK}/api/products?category=fruit`);
        console.log("Data from API:", res.data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

setTimeout(testAPI, 2000);
