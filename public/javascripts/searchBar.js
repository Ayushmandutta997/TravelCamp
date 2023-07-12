// Get references to the search input and search button elements
const searchInput = document.getElementById('searchbar');
const searchButton = document.getElementById('searchButton');

// Adding a click event listener to the search button
searchButton.addEventListener('click', function() {
    // search term from the input and convert it to lowercase
    const searchTerm = searchInput.value.toLowerCase();

    // Get all the campground elements
    const campgrounds = document.getElementsByClassName('campground');

    // Loop through each campground element
    Array.from(campgrounds).forEach(function(campground) {
        // Get the title and location text content from each campground element and convert them to lowercase
        const title = campground.querySelector('.card-title').textContent.toLowerCase();
        const location = campground.querySelector('.card-text small').textContent.toLowerCase();

        // Checking if the search term is present in the title or location
        if (title.includes(searchTerm) || location.includes(searchTerm)) {
            campground.style.display = 'block';
        } else {
            campground.style.display = 'none';
        }
    });
});