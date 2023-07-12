(() => {
    'use strict'
    
// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.validated-form')

// Loop over them and prevent submission
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
    // Check if the form is valid    
    if (!form.checkValidity()) {
        event.preventDefault() // Prevent form submission
        event.stopPropagation() // Stop event propagation
    }

    form.classList.add('was-validated')
    }, false)
})
})

// Scroll to Top onload
window.addEventListener('load', function() {
    window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
    }); 
});