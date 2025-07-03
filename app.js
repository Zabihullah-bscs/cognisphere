// Sidebar elements //
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

const hoverSign = document.querySelector('.hover-sign');

// Contact Us button functionality
document.getElementById('contactUsButton').addEventListener('click', function() {
    document.querySelector('.final-contact-section').scrollIntoView({ behavior: 'smooth' });
});

// Sidebar elements //
menu.addEventListener("click", function() {
    sideBar.classList.remove("close-sidebar");
    sideBar.classList.add("open-sidebar");
});

closeIcon.addEventListener("click", function() {
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
});

// Ribbon bar buttons functionality //
document.querySelectorAll('.logo-bar-buttons > li > a').forEach(function(button) {
    button.addEventListener('click', function(event) {
        const targetSection = this.textContent.trim();

        // Only prevent default for links that are meant to scroll
        if (['Home', 'About Us', 'Our Work', 'Contact Us'].includes(targetSection)) {
            event.preventDefault();
        }

        switch (targetSection) {
            case 'Home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'About Us':
                document.querySelector('.info-section').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'Our Work':
                document.querySelector('.my-project').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'Contact Us':
                document.querySelector('.final-contact-section').scrollIntoView({ behavior: 'smooth' });
                break;
            default:
                // For "Our Services" and dropdown links, do nothing and let the default link behavior occur.
                break;
        }
    });
});

// Footer functionality //
document.querySelectorAll('.footer-column.contact p i').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const iconClass = this.className;

        switch (iconClass) {
            case 'bx bxs-map':
                window.open('https://maps.google.com', '_blank');
                break;
            case 'bx bxs-phone':
                window.open('tel:+39111222444', '_blank');
                break;
            case 'bx bxs-envelope':
                window.open('mailto:contact@cognisphere.com', '_blank');
                break;
            default:
                break;
        }
    });
});

// Ribbon bar icons functionality //
document.querySelectorAll('.box-icons p').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const iconClass = this.querySelector('i').className;

        switch (iconClass) {
            case 'bx bxs-phone':
                window.open('tel:+39111222444', '_blank');
                break;
            case 'bx bxl-github':
                window.open('https://github.com', '_blank');
                break;
            case 'bx bxl-linkedin-square':
                window.open('https://www.linkedin.com', '_blank');
                break;
            default:
                break;
        }
    });
});





// Services carousel functionality //
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const servicesTrack = document.querySelector('.services-track');
const serviceCards = document.querySelectorAll('.service-card');
const cardWidth = serviceCards[0].offsetWidth + 20; // card width + margin
const totalWidth = cardWidth * serviceCards.length;
const containerWidth = document.querySelector('.services-carousel-wrapper').offsetWidth;
const maxPosition = -(totalWidth - containerWidth);

let currentPosition = 0;
let autoScroll;

const startAutoScroll = () => {
    servicesTrack.style.animation = 'vertical-scroll-animation 12s ease-in-out infinite';
};

const stopAutoScroll = () => {
    servicesTrack.style.animation = 'none';
};

servicesTrack.style.transition = 'transform 0.5s ease-in-out';

leftArrow.addEventListener('click', () => {
    stopAutoScroll();
    currentPosition += cardWidth;
    if (currentPosition > 0) {
        currentPosition = 0;
    }
    servicesTrack.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
    clearTimeout(autoScroll);
    autoScroll = setTimeout(startAutoScroll, 5000); // Restart after 5 seconds
});

rightArrow.addEventListener('click', () => {
    stopAutoScroll();
    currentPosition -= cardWidth;
    if (currentPosition < maxPosition) {
        currentPosition = maxPosition;
    }
    servicesTrack.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
    clearTimeout(autoScroll);
    autoScroll = setTimeout(startAutoScroll, 5000); // Restart after 5 seconds
});

startAutoScroll();

// Stats counter animation for circle-progress elements
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.circle-progress');
    const circumference = 2 * Math.PI * 72; // Circumference of the circle with radius 72 (updated for larger size)

    counters.forEach(counter => {
        const value = parseFloat(counter.getAttribute('data-value'));
        const unit = counter.getAttribute('data-unit');
        const progressBar = counter.querySelector('.progress-bar');
        const counterText = counter.querySelector('.counter');
        let currentValue = 0;
        const increment = value / 50; // Adjust speed of animation

        progressBar.style.strokeDasharray = circumference;
        progressBar.style.strokeDashoffset = circumference;

        // Immediately set the final value on page load to ensure display
        currentValue = value;
        const progressOffset = circumference - (currentValue / value) * circumference;
        progressBar.style.strokeDashoffset = progressOffset;
        counterText.textContent = currentValue.toFixed(1) + unit;

        function animateCounter() {
            if (currentValue < value) {
                currentValue += increment;
                if (currentValue > value) currentValue = value;
                const progressOffset = circumference - (currentValue / value) * circumference;
                progressBar.style.strokeDashoffset = progressOffset;
                counterText.textContent = currentValue.toFixed(1) + unit;
                requestAnimationFrame(animateCounter);
            }
        }

        // Animation can still run if needed
        setTimeout(animateCounter, 100);
    });
});

// Counting animation for percentage texts and progress bars in .circle elements
document.addEventListener('DOMContentLoaded', function() {
    const percentageCounters = document.querySelectorAll('.circle h2[data-target]');
    console.log('Found percentage counters:', percentageCounters.length);

    function animateCounter(counter, index) {
        const targetValue = parseInt(counter.getAttribute('data-target'));
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 100); // Slower increment for more visible steps
        const circle = counter.parentElement;
        const progressBar = circle.querySelector('.progress-fg');
        const circumference = 2 * Math.PI * 100; // Circumference for radius 100
        console.log('Animating counter to target:', targetValue);

        // For the first circle, set initial value to 85% immediately
        if (index === 0 && targetValue === 85) {
            currentValue = 85;
            counter.textContent = '85%';
            if (progressBar) {
                progressBar.style.strokeDasharray = circumference;
                const progressOffset = circumference - (85 / 100) * circumference;
                progressBar.style.strokeDashoffset = progressOffset;
                progressBar.style.stroke = `rgb(77, ${Math.round(255 - ((85 - 50) / 50) * 183)}, ${Math.round(222 - ((85 - 50) / 50) * 81)})`; // Blue for 85%
                progressBar.style.transition = 'none'; // No animation for initial set
            }
            return; // Skip animation for this circle
        } else {
            // Explicitly reset the counter and progress bar to 0 before starting animation for other circles
            counter.textContent = '0%';
            if (progressBar) {
                progressBar.style.strokeDasharray = circumference;
                progressBar.style.strokeDashoffset = circumference;
                progressBar.style.stroke = '#ff4d4d'; // Start with red for low values
                progressBar.style.transition = 'stroke-dashoffset 0.05s ease-out, stroke 0.05s ease-out'; // Smooth transition for fill and color
            }
        }

        function animatePercentageCounter() {
            if (currentValue < targetValue) {
                currentValue += increment;
                if (currentValue > targetValue) currentValue = targetValue;
                counter.textContent = currentValue + '%';
                if (progressBar) {
                    const progressOffset = circumference - (currentValue / 100) * circumference;
                    progressBar.style.strokeDashoffset = progressOffset;
                    // Change color based on current value: red (0%) to yellow (50%) to blue (100%)
                    let color;
                    if (currentValue < 50) {
                        color = `rgb(${Math.round(255 - (currentValue / 50) * 255)}, ${Math.round((currentValue / 50) * 255)}, 77)`; // Red to Yellow
                    } else {
                        color = `rgb(77, ${Math.round(255 - ((currentValue - 50) / 50) * 183)}, ${Math.round(222 - ((currentValue - 50) / 50) * 81)})`; // Yellow to Blue (#72a1de)
                    }
                    progressBar.style.stroke = color;
                }
                setTimeout(animatePercentageCounter, 30); // Slower animation speed for better visibility
            }
        }

        // Start animation with a delay to ensure page is loaded
        setTimeout(animatePercentageCounter, 500);
    }

    // Trigger animation for all counters after a short delay on page load
    setTimeout(() => {
        percentageCounters.forEach((counter, index) => {
            animateCounter(counter, index);
        });
    }, 500);
});
