document.addEventListener('DOMContentLoaded', () => {
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

    nextArrow.addEventListener('click', nextSlide);
    prevArrow.addEventListener('click', prevSlide);

    // Auto-play the slider
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
});
