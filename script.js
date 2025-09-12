async function fetchData() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return await data;
    } catch (error) {
        console.error("Could not fetch data:", error.message);
        return [];
    }
}

async function init() {
    const data = await fetchData();
    console.log(data);
}

init();
