document.addEventListener("DOMContentLoaded", function() {

    // --- Dynamic Project Video Hover ---
    const projectVideos = document.querySelectorAll('.project-vidbox video');
    const hoverSign = document.querySelector('.hover-sign');

    projectVideos.forEach(video => {
        video.addEventListener("mouseover", function() {
            video.play();
            if (hoverSign) {
                hoverSign.classList.add("active");
            }
        });
        video.addEventListener("mouseout", function() {
            video.pause();
            if (hoverSign) {
                hoverSign.classList.remove("active");
            }
        });
    });

    // --- Sidebar Functionality ---
    const sideBar = document.querySelector('.sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

    // Open sidebar
    if (menuIcon) {
        menuIcon.addEventListener("click", function() {
            sideBar.classList.remove("close-sidebar");
            sideBar.classList.add("open-sidebar");
        });
    }

    // Close sidebar with 'X' icon
    if (closeIcon) {
        closeIcon.addEventListener("click", function() {
            sideBar.classList.remove("open-sidebar");
            sideBar.classList.add("close-sidebar");
        });
    }

    // Close sidebar when a link is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener("click", function() {
            sideBar.classList.remove("open-sidebar");
            sideBar.classList.add("close-sidebar");
        });
    });

    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.final-contact-section form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Show success message
            submitButton.innerHTML = '<i class="bx bx-check-circle"></i> Message Sent!';
            submitButton.disabled = true;

            // Optional: Reset form and button after a few seconds
            setTimeout(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                contactForm.reset(); // Clears all form fields
            }, 4000); // 4 seconds
        });
    }
});