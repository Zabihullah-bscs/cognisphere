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

    // Counting animation for percentage texts in .circle h2 elements
    const percentageCounters = document.querySelectorAll('.circle h2[data-target]');
    percentageCounters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target'));
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 50); // Adjust speed of animation

        // Reset the counter to 0 on page load
        counter.textContent = '0%';

        function animatePercentageCounter() {
            if (currentValue < targetValue) {
                currentValue += increment;
                if (currentValue > targetValue) currentValue = targetValue;
                counter.textContent = currentValue + '%';
                setTimeout(animatePercentageCounter, 20);
            }
        }

        // Start animation immediately
        animatePercentageCounter();
    });
});
