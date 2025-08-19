document.addEventListener('DOMContentLoaded', () => {
    // Enhanced mobile functionality and responsive features
    
    // Touch gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Hero slider touch gestures
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        heroSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
    
    // Mobile menu enhancements
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');
    const closeIcon = document.querySelector('.close-icon');
    const body = document.body;
    
    // Prevent body scroll when sidebar is open
    function toggleBodyScroll(disable) {
        if (disable) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
    
    // Enhanced menu toggle with body scroll control
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            sidebar.classList.add('active');
            toggleBodyScroll(true);
        });
    }
    
    if (closeIcon) {
        closeIcon.addEventListener('click', () => {
            sidebar.classList.remove('active');
            toggleBodyScroll(false);
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && !menuIcon.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            toggleBodyScroll(false);
        }
    });
    
    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            toggleBodyScroll(false);
        }
    });
    
    // Enhanced sidebar dropdown functionality
    const sidebarDropdowns = document.querySelectorAll('.sidebar-dropdown');
    
    sidebarDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.sidebar-submenu');
        
        if (link && submenu) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
                submenu.classList.toggle('active');
            });
        }
    });
    
    // Responsive navigation - hide dropdowns on mobile
    function handleResize() {
        if (window.innerWidth <= 768) {
            // On mobile, ensure dropdowns are properly handled
            document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        } else {
            // On desktop, restore dropdown functionality
            document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
                dropdown.style.display = '';
            });
        }
    }
    
    // Initial call and resize listener
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Mobile-optimized carousel for services
    const servicesTrack = document.querySelector('.services-track');
    if (servicesTrack && window.innerWidth <= 768) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        servicesTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - servicesTrack.offsetLeft;
            scrollLeft = servicesTrack.scrollLeft;
        });
        
        servicesTrack.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        servicesTrack.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        servicesTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - servicesTrack.offsetLeft;
            const walk = (x - startX) * 2;
            servicesTrack.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Intersection Observer for animating circular progress bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const circleWrapper = entry.target;
            const progressFg = circleWrapper.querySelector('.progress-fg');
            const counterElement = circleWrapper.querySelector('.counter h2');
            const percentage = parseInt(circleWrapper.getAttribute('data-percentage'));
            const circumference = 2 * Math.PI * 120; // Circumference of the circle (r=120)

            if (entry.isIntersecting) {
                // Calculate the target offset based on percentage
                const targetOffset = circumference - (percentage / 100) * circumference;
                progressFg.style.strokeDashoffset = targetOffset;

                // Animate the counter from 0 to the target percentage
                let currentCount = 0;
                const duration = 1500; // 1.5 seconds to match the progress bar animation
                const stepTime = duration / percentage;
                const counterInterval = setInterval(() => {
                    if (currentCount >= percentage) {
                        clearInterval(counterInterval);
                    } else {
                        currentCount++;
                        counterElement.textContent = currentCount + '%';
                    }
                }, stepTime);
                circleWrapper.dataset.counterInterval = counterInterval; // Store interval ID for cleanup
            } else {
                // Reset to initial state when out of view
                progressFg.style.strokeDashoffset = circumference;
                counterElement.textContent = '0%';
                // Clear any running interval
                if (circleWrapper.dataset.counterInterval) {
                    clearInterval(circleWrapper.dataset.counterInterval);
                    circleWrapper.dataset.counterInterval = '';
                }
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the element is in view
    });

    // Observe all elements with class 'stat-circle-wrapper'
    document.querySelectorAll('.stat-circle-wrapper').forEach((circle) => {
        observer.observe(circle);
    });

    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    let currentSlide = 0;

    function showSlide(index) {
        const currentActiveSlide = document.querySelector('.hero-slider .slide.active');
        if (currentActiveSlide) {
            currentActiveSlide.classList.remove('active');
            currentActiveSlide.classList.add('slide-out');
        }

        const nextSlideToShow = slides[index];
        nextSlideToShow.classList.remove('slide-out'); // Ensure it's not sliding out
        nextSlideToShow.classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextArrow && prevArrow) {
        nextArrow.addEventListener('click', nextSlide);
        prevArrow.addEventListener('click', prevSlide);
    }

    // Auto-play the slider (only on desktop)
    if (window.innerWidth > 768) {
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    // Pause auto-play on mobile to save battery
    let autoPlayInterval;
    
    function startAutoPlay() {
        if (window.innerWidth > 768) {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Start auto-play initially
    startAutoPlay();
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            handleResize();
            // Restart auto-play after orientation change
            stopAutoPlay();
            startAutoPlay();
        }, 500);
    });
});

// Animate the custom AI solutions section on scroll
    const solutionsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.5
    });

    const solutionsSection = document.querySelector('.custom-ai-solutions');
    if (solutionsSection) {
        solutionsObserver.observe(solutionsSection);
    }

// Curved text animation
    const trainingText = document.querySelector('.training-text');
    if (trainingText) {
        const letters = trainingText.querySelectorAll('span');
        const radius = 150; // Adjust this value to control the circle's radius
        const circumference = 2 * Math.PI * radius;
        const letterWidth = 15; // Approximate width of each letter, adjust as needed
        const totalLettersWidth = letters.length * letterWidth;
        const anglePerLetter = (totalLettersWidth / circumference) * 360;
        const startAngle = -90 - (anglePerLetter * letters.length / 2); // Adjust start angle to center the text

        letters.forEach((letter, i) => {
            letter.style.position = 'absolute';
            letter.style.top = '50%';
            letter.style.left = '50%';
            letter.style.transformOrigin = `0 ${radius}px`;
            letter.style.transform = `rotate(${startAngle + (i * anglePerLetter)}deg) translateY(-50%)`;
        });
    }

// Menu Toggle
const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.querySelector('.sidebar');
const closeIcon = document.querySelector('.close-icon');

menuIcon.addEventListener('click', () => {
    sidebar.classList.add('active');
});

closeIcon.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Sidebar Dropdown Toggle
const sidebarDropdowns = document.querySelectorAll('.sidebar-dropdown');

sidebarDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('active');
        const submenu = dropdown.querySelector('.sidebar-submenu');
        submenu.classList.toggle('active');
    });
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuIcon.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Header scroll effect is now handled by header-scroll.js


document.addEventListener('DOMContentLoaded', () => {
    const contactUsButton = document.getElementById('contactUsButton');
    if (contactUsButton) {
        contactUsButton.addEventListener('click', () => {
            window.location.href = 'about-us/contact-us.html';
        });
    }

    const bookMeetingButton = document.querySelector('.book-meeting-button');
    if (bookMeetingButton) {
        bookMeetingButton.addEventListener('click', () => {
            window.location.href = 'about-us/contact-us.html#calendar-booking-section';
        });
    }
});
