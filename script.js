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
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        };
        const data = await response.json();
        return data;
    } catch (error) {
        groceryContainer.innerHTML = `
            <p class="capitalize text-gray-500">Could not fetch data: ${error.message}</p>
        `;
        return [];
    }
}

// This function finds the specific product and displays it
async function displayProduct(searchItem) {
    // Get the data
    const data = await fetchData();

    // Search the array for the matching item
    const category = data.filter(item => item.category === searchItem.toLowerCase() || item.name === searchItem.toLowerCase());

    // If the search returns undefined or an empty array, display a message
    if (category.length === 0) {
        groceryContainer.innerHTML = `
            <p class="text-gray-200">Item not found.</p>
        `;

        return;
    }

    // If the item/category is found, display the items
    category.forEach((item) => {
        groceryContainer.innerHTML += `
            <div class="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="https://placehold.co/1x1" alt="">
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5 class="capitalize text-center mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${item.name}</h5>
                    <div class="flex flex-wrap justify-center gap-4 md:w-72 leading-normal">
                        <p class="mb-3 font-normal text-xl text-gray-700 dark:text-green-400">$${item.price}</p>
                        <p class="capitalize mb-3 font-normal text-xl text-gray-700 dark:text-orange-400">${item.inStock}</p>
                        <p class="capitalize mb-3 font-normal text-xl text-gray-700 dark:text-blue-400">${item.category}</p>
                    </div>
                </div>
            </div>
        `;
    });
}
// }

// This function enables voice search functionality
function voiceSearch() {
    // Get the mic btn
    const micBtn = document.getElementById("voice-search");

    // Get the SpeechRecognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Get the SVG path inside the mic btn
    const micSVGPath = micBtn.querySelector("path");

    // Check if the browser supports the Web Speech API and configure it
    micBtn.addEventListener("click", () => {
        if (SpeechRecognition) {
            // Add a class to the mic btn when click
            micSVGPath.classList.add("recording");

            // Start a new session of SpeechRecognition
            const recognition = new SpeechRecognition();
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

        } else {
            // Display a message if the browser doesn't support the Web Speech API
            groceryContainer.innerHTML = `
                <p class="text-gray-900 dark:text-white">Speech Recognition not supported in this browser.</p>
            `;

            // Remove the recording class if the browser doesn't support the Web Speech API
            micSVGPath.classList.remove("recording");
        }
    });
}

// Call the voiceSearch function to enable voice search functionality
voiceSearch();
