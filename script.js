import { API_LINK } from "./config.js";

// Get the search field
const formElement = document.getElementById('default-search');
// Get the search btn
const searchBtn = document.getElementById('search-btn');
// Get the div to display groceries
const groceryContainer = document.getElementById('grocery');
// Get the mic button
const micBtn = document.getElementById('voice-search');
// Get the spinner
const spinner = document.getElementById('spinner');

// Add click event to the search btn
// Use preventDefault() to prevent the form from submitting
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (formElement.value === '') {
        groceryContainer.innerHTML = `
            <p>Please enter an item to search!</p>
        `;

        // Focus on the search field if it's empty so the user can enter a value
        formElement.focus();

        return;
    }
    // Call searchProducts() display products based on search input
    searchProducts(formElement.value);
})

// Call filterCategories() display products based on category selected
filterCategories();
// Call the voiceSearch function to enable voice search functionality
voiceSearch();

// This function fetch the data from the API
async function fetchData() {
    // Show the spinner
        spinner.classList.remove('hidden');

        // Delay for the spinner visibility
        await new Promise(resolve => setTimeout(resolve, 500));

    // Catch errors if there's any network issues
    try {
        const response = await fetch(API_LINK + '/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        };
        const data = await response.json();

        // Hide the spinner after fetching data
        spinner.classList.add('hidden');

        return data;
    } catch (error) {
        // Hide the spinner if there's an error
        spinner.classList.add('hidden');

        // Display error message if there's an error
        groceryContainer.innerHTML = `
            <p class="capitalize text-gray-500">Could not fetch data: ${error.message}</p>
        `;
        return [];
    }
}

// This function renders products
function renderProducts(products) {
    // Clear the previous search results
    groceryContainer.innerHTML = '';

    // If no products found, display a message
    if (products.length === 0) {
            groceryContainer.innerHTML = `
                <p>"${formElement.value}" not found!</p>
            `;
        return;
    }

    // If products are found, display them
    products.forEach((item) => {
        groceryContainer.innerHTML += `
            <div class="flex flex-col md:flex-row items-center bg-gray-400 rounded-lg shadow-sm md:flex-row md:max-w-xl dark:bg-gray-800">
                <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="https://placehold.co/1x1" alt="">
                <div class="flex flex-col justify-between items-center p-4 leading-normal w-full">
                    <h5 class="capitalize text-center mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${item.name}</h5>
                    <div class="flex flex-wrap justify-center gap-4 md:w-72 leading-normal">
                        <p class="mb-3 font-normal text-xl text-green-900 dark:text-green-400">$${item.price}</p>
                        <p class="capitalize mb-3 font-normal text-xl text-orange-900 dark:text-orange-400">${item.inStock}</p>
                        <p class="capitalize mb-3 font-normal text-xl text-blue-900 dark:text-blue-400">${item.category}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// This function filters the categories in the dropdown menu
async function filterCategories() {
    // Get the dropdown menu
    const dropdown = document.getElementById("categories");

    // Add an event listener to the dropdown menu
    dropdown.addEventListener('change', async (event) => {
        formElement.value = '';

        // get the data
        const data = await fetchData();
        // Get the selected value
        const selectedCategory = event.target.value;

        // Filter the data based on the selected value
        // Convert the selected value to lowercase to match the category values in the JSON file
        const category = data.filter(item => item.category.includes(selectedCategory.toLowerCase()));

        // Display the selected category
        renderProducts(category);

        // Reset the filter field
        setTimeout(() => {
            dropdown.selectedIndex = 0;
        }, 1500);
    });
}

// This function displays products based on the search input
async function searchProducts(searchItem) {
    // get the data
    const data = await fetchData();

    // Filter the data based on the search term
    const item = data.filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase()));

    // Display the search results
    renderProducts(item);
}

// This function enables voice search functionality
function voiceSearch() {
    // Get the SpeechRecognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Store a new session of SpeechRecognition in a variable
    const recognition = new SpeechRecognition();

    // Get the SVG path inside the mic btn
    const micSVGPath = micBtn.querySelector("path");

    // Check if the browser supports the Web Speech API and configure it
    if (SpeechRecognition) {
        micBtn.addEventListener("click", () => {
            // If the mic is already recording, stop it.
            if (micSVGPath.classList.contains("recording")) {
                recognition.stop();
                return;
            }

            // Add a class to the mic btn when click
            micSVGPath.classList.add("recording");

            // Prevent the recording from stopping automatically
            recognition.continuous = false;
            // Set the language to English (US)
            recognition.lang = "en-US";
            // Enable live transcription
            recognition.interimResults = true;

            // Start the speech recognition
            recognition.start();

            // Get the transcript and display it in the search bar
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                formElement.value = transcript;
            };

            // Display error message if there's any
            recognition.onerror = (event) => {
                groceryContainer.innerHTML = `
                    <p class="text-gray-900 dark:text-white">Error: ${event.error}.</p>
                `;

                // Remove the recording class if there's an error
                micSVGPath.classList.remove("recording");
            };

            // Automatically trigger the search button when the user stop speaking
            recognition.onend = () => {
                searchBtn.click();

                // Remove the recording class
                micSVGPath.classList.remove("recording");
            };
        });
    } else {
            // Display a message if the browser doesn't support the Web Speech API
            groceryContainer.innerHTML = `
                <p class="text-gray-900 dark:text-white">Speech Recognition not supported in this browser.</p>
            `;

            // Remove the recording class if the browser doesn't support the Web Speech API
            micSVGPath.classList.remove("recording");
        }   
}