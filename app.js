document.addEventListener('DOMContentLoaded', () => {
    // Enhanced mobile functionality and responsive features
    // Normalize header right-side icons across all pages to match homepage
    try {
        const headerIconBars = document.querySelectorAll('header .box-icons');
        headerIconBars.forEach(iconBar => {
            // If the icon bar uses <p><i ...></i></p> (non-link), replace with homepage anchors
            const hasParagraphIcons = iconBar.querySelector('p i');
            const hasAnchors = iconBar.querySelector('a i');
            if (hasParagraphIcons && !hasAnchors) {
                iconBar.innerHTML = ""
                    + "<a href=\"tel:+923068952115\"><i class='bx bxs-phone'></i></a>"
                    + "<a href=\"https://github.com/cognisphere\" target=\"_blank\"><i class='bx bxl-github'></i></a>"
                    + "<a href=\"https://linkedin.com/company/cognisphere\" target=\"_blank\"><i class='bx bxl-linkedin-square'></i></a>";
            }
        });
    } catch (_) {}
    
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
    
    // Mobile menu functionality moved to bottom of file for better organization
    
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

// Enhanced Mobile Menu Toggle (Improved version)
document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');
    const closeIcon = document.querySelector('.close-icon');
    const body = document.body;

    // Ensure mobile sidebar contains full, standardized lists
    function getPathPrefix() {
        try {
            const path = window.location.pathname.replace(/\\\\/g, '/');
            const marker = '/cognisphere/';
            const markerIndex = path.lastIndexOf(marker);
            const relative = markerIndex >= 0 ? path.substring(markerIndex + marker.length) : path;
            const depth = (relative.match(/\//g) || []).length; // number of slashes after project root
            return depth >= 1 ? '../' : '';
        } catch (_) {
            return '';
        }
    }

    function standardizeMobileSidebar() {
        const prefix = getPathPrefix();
        const dropdowns = Array.from(document.querySelectorAll('.sidebar-dropdown'));

        const findDropdown = (label) => dropdowns.find(d => {
            const a = d.querySelector('a');
            return a && a.textContent.trim().toLowerCase().includes(label);
        });

        const servicesDropdown = findDropdown('services');
        const solutionsDropdown = findDropdown('solutions');
        const aboutDropdown = findDropdown('about us');

        if (servicesDropdown) {
            const ul = servicesDropdown.querySelector('.sidebar-submenu');
            if (ul) {
                ul.innerHTML = `
                    <li><a href="${prefix}services/data-services.html">Data Services</a></li>
                    <li><a href="${prefix}services/data-engineering.html">Data Engineering</a></li>
                    <li><a href="${prefix}services/cloud-data-ai.html">Cloud, Data & AI</a></li>
                    <li><a href="${prefix}services/data-strategy.html">Data Strategy</a></li>
                    <li><a href="${prefix}services/data-privacy-security.html">Data Privacy & Security</a></li>
                `;
            }
        }

        if (solutionsDropdown) {
            const ul = solutionsDropdown.querySelector('.sidebar-submenu');
            if (ul) {
                ul.innerHTML = `
                    <li><a href="${prefix}solutions/artificial-intelligence.html">Artificial Intelligence</a></li>
                    <li><a href="${prefix}solutions/advanced-analytics.html">Advanced Analytics</a></li>
                    <li><a href="${prefix}solutions/business-intelligence.html">Business Intelligence</a></li>
                    <li><a href="${prefix}solutions/ai-powered-automation.html">AI-Powered Automation</a></li>
                    <li><a href="${prefix}solutions/ai-powered-contact-center.html">AI-Powered Contact Center</a></li>
                    <li><a href="${prefix}solutions/generative-ai-llms.html">Generative AI & LLMs</a></li>
                    <li><a href="${prefix}solutions/aws.html">Amazon Web Services (AWS)</a></li>
                    <li><a href="${prefix}solutions/microsoft-azure.html">Microsoft Azure</a></li>
                    <li><a href="${prefix}solutions/google-cloud-platform.html">Google Cloud Platform</a></li>
                    <li><a href="${prefix}solutions/iot-edge-analytics.html">IoT & Edge Analytics</a></li>
                `;
            }
        }

        if (aboutDropdown) {
            const ul = aboutDropdown.querySelector('.sidebar-submenu');
            if (ul) {
                ul.innerHTML = `
                    <li><a href="${prefix}about-us/careers.html">Careers</a></li>
                    <li><a href="${prefix}about-us/our-work.html">Our Work</a></li>
                    <li><a href="${prefix}about-us/contact-us.html">Contact Us</a></li>
                `;
            }
        }
    }

    // Build standardized menus before wiring events
    standardizeMobileSidebar();
    
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
        // Remove any existing event listeners to prevent conflicts
        menuIcon.replaceWith(menuIcon.cloneNode(true));
        const newMenuIcon = document.querySelector('.menu-icon');
        
        newMenuIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu icon clicked'); // Debug log
            if (sidebar) {
                console.log('Sidebar found, adding active class');
                sidebar.classList.add('active');
                console.log('Sidebar classes after adding active:', sidebar.className);
                toggleBodyScroll(true);
            } else {
                console.log('Sidebar not found!');
            }
        });
    } else {
        console.log('Menu icon not found'); // Debug log
    }
    
    if (closeIcon) {
        // Remove any existing event listeners to prevent conflicts
        closeIcon.replaceWith(closeIcon.cloneNode(true));
        const newCloseIcon = document.querySelector('.close-icon');
        
        newCloseIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close icon clicked'); // Debug log
            if (sidebar) {
                sidebar.classList.remove('active');
                toggleBodyScroll(false);
            }
        });
    } else {
        console.log('Close icon not found'); // Debug log
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && !menuIcon?.contains(e.target) && sidebar.classList.contains('active')) {
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
    
    // Enhanced sidebar dropdown functionality (mobile accordion)
    const sidebarDropdowns = document.querySelectorAll('.sidebar-dropdown');
    
    function setSubmenuHeight(submenu, isOpen) {
        if (!submenu) return;
        if (isOpen) {
            submenu.classList.add('active');
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
        } else {
            submenu.style.maxHeight = '0px';
            submenu.classList.remove('active');
        }
    }
    
    sidebarDropdowns.forEach(currentDropdown => {
        const link = currentDropdown.querySelector('a');
        const submenu = currentDropdown.querySelector('.sidebar-submenu');
        
        if (link && submenu) {
            // Initialize collapsed state
            setSubmenuHeight(submenu, false);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other open dropdowns (accordion behavior)
                sidebarDropdowns.forEach(other => {
                    if (other !== currentDropdown) {
                        other.classList.remove('active');
                        const otherSubmenu = other.querySelector('.sidebar-submenu');
                        setSubmenuHeight(otherSubmenu, false);
                    }
                });
                
                const willOpen = !currentDropdown.classList.contains('active');
                currentDropdown.classList.toggle('active', willOpen);
                setSubmenuHeight(submenu, willOpen);
            });
        }
    });
    
    // Handle resize events - close menu on desktop
    function handleResize() {
        if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            toggleBodyScroll(false);
        }
    }
    
    window.addEventListener('resize', handleResize);
});

// Header scroll effect is now handled by header-scroll.js


// Function to ensure dropdown functionality works on all pages
function ensureDropdownFunctionality() {
    const dropdownItems = document.querySelectorAll('.logo-bar-buttons > li');
    
    dropdownItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown-menu');
        if (dropdown) {
            // Add mouseenter event
            item.addEventListener('mouseenter', () => {
                dropdown.style.maxHeight = '60vh';
                dropdown.style.opacity = '1';
                dropdown.style.visibility = 'visible';
                dropdown.style.display = 'flex';
                dropdown.style.zIndex = '1001';
            });
            
            // Add mouseleave event
            item.addEventListener('mouseleave', () => {
                dropdown.style.maxHeight = '0';
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure dropdown functionality works
    ensureDropdownFunctionality();
    
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
