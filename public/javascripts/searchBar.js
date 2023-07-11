const searchInput = document.getElementById('searchbar');
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const campgrounds = document.getElementsByClassName('campground');
    Array.from(campgrounds).forEach(function(campground) {
        const title = campground.querySelector('.card-title').textContent.toLowerCase();
        const location = campground.querySelector('.card-text small').textContent.toLowerCase();
        if (title.includes(searchTerm) || location.includes(searchTerm)) {
            campground.style.display = 'block';
        } else {
            campground.style.display = 'none';
        }
    });
});