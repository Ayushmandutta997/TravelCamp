// Function to check if an element is in the viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const screenHeight = window.innerHeight || document.documentElement.clientHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;
    
    const threshold = elementHeight / 2;
    
    return elementTop - threshold <= screenHeight;
  }
  

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
