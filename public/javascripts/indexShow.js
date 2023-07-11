// Function to check if an element is in the viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) 
    );
}

// Function to handle the scroll event
function handleScroll() {
    const campgrounds = document.querySelectorAll('.campground');
    for (let i = 0; i < campgrounds.length; i++) {
      const campground = campgrounds[i];
      if (i === 0) {
        campground.classList.add('animate');
      } else {
        if (isElementInViewport(campground)) {
          campground.classList.add('animate');
        }
      }
    }
  }
  

// Attach scroll event listener
window.addEventListener('scroll', handleScroll);

// Initial check on page load
handleScroll();
