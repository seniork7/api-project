// Get the search field
const formElement = document.getElementById('default-search');

// Get the search btn
const searchBtn = document.getElementById('search-btn');

// Get the div to display groceries
const groceryContainer = document.getElementById('grocery');


// Add click event to the search btn
// Use preventDefault() to prevent the form from submitting
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    displayProduct(formElement.value);
})

// This function fetch the data from the API (JSON file)
async function fetchData() {
    // Catch errors if there's any network issues
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return await data;
    } catch (error) {
        groceryContainer.innerHTML = `
        <p class="capitalize text-gray-500">Could not fetch data: ${error.message}</p>`;
        return [];
    }
}

// This function finds the specific product and displays it
async function displayProduct(searchItem) {
    // Get the data
    const data = await fetchData();

    // Search the array for the matching item
    const foundItem = data.find(item => item.name === searchItem.toLowerCase());

    // If undefined, display a message
    if (foundItem === undefined) {
        groceryContainer.innerHTML = `
            <p class="text-gray-200">Item not found.</p>`;
    } else {
        // Else display the item
        groceryContainer.innerHTML = `
            <p class="capitalize text-gray-200">${foundItem.name}</p>
            <p class="capitalize text-gray-200">${foundItem.inStock}</p>
            <p class=" text-gray-200">$${foundItem.price}</p>`;
    }
}

