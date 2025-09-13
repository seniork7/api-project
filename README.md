# Grocery Store API Project

## Objective
The goal of this project is to simulate a grocery store API using JSON and JavaScript.

## Purpose
This project demonstrates how to fetch data, handle errors, display products dynamically, and implement basic features like search and category filtering without a backend server.

## Tech Stack
- HTML
- [Tailwindcss](https://v3.tailwindcss.com/)
- [Flowbite](https://flowbite.com/)
- JavaScript
- JSON

## Process
I created the site's structure with HTML and used both the [Tailwindcss](https://v3.tailwindcss.com/) & [Flowbite](https://flowbite.com/) frameworks to add modern styles and components.

An array of 55 products including name, category, price, stock status, and image was created in a JSON file.

I fetched each product asynchronously using an async function. In case of any network issues or file damage, I wrapped the code in a try...catch block. This way I can catch any possible errors and display to the user.

For the search functionality, I used the .find() array method to find the matching product in the array from the fetched data. Initially, I tried using the .forEach method with an if statement inside but I noticed that even when the product was found and the loop was set to return, it actually continued to the else condition. After doing some research I came across the  .find() method, which is a simpler approach and provides cleaner code.