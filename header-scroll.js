// Header scroll effect for all pages
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    
    // Remove any existing inline scroll event handlers
    const oldScriptElements = document.querySelectorAll('script');
    oldScriptElements.forEach(script => {
        if (script.textContent && script.textContent.includes('header.classList.add(\'scrolled\')')) {
            script.remove();
        }
    });

    // Initial check to set the header state on page load
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});