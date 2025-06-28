const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');

// Sidebar elements //
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

const hoverSign = document.querySelector('.hover-sign');

const videoList = [video1, video2, video3];

videoList.forEach(function(video) {
    video.addEventListener("mouseover", function() {
        video.play();
        hoverSign.classList.add("active");
    });
    video.addEventListener("mouseout", function() {
        video.pause();
        hoverSign.classList.remove("active");
    });
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
