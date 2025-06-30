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
document.querySelectorAll('.logo-bar-buttons li a').forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const targetSection = this.textContent.trim();

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
            case 'Our Services':
                document.querySelector('.my-project').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'Contact Us':
                document.querySelector('.final-contact-section').scrollIntoView({ behavior: 'smooth' });
                break;
            default:
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
