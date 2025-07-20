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

    // Image Slider Logic
    const sliderImages = document.querySelectorAll('.hero-image-slider .slider-image');
    let currentImageIndex = 0;

    function showImage(index) {
        // Remove 'active' from all images
        sliderImages.forEach(img => {
            img.classList.remove('active');
        });
        // Add 'active' to the current image
        sliderImages[index].classList.add('active');
    }

    function nextImage() {
        const prevImage = sliderImages[currentImageIndex]; // The image currently active
        currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
        const nextImage = sliderImages[currentImageIndex]; // The image that will become active

        // 1. Make the current active image start leaving
        prevImage.classList.add('leaving');
        prevImage.classList.remove('active'); // Remove active immediately so 'leaving' transition can start

        // 2. Make the next image active (it will slide in from -100% to 0)
        nextImage.classList.add('active');

        // 3. After the transition, clean up the 'leaving' class from the old image
        // This is crucial for the next cycle, so the image can reset its transform
        setTimeout(() => {
            prevImage.classList.remove('leaving');
        }, 1000); // Match CSS transition duration
    }

    // Initial display
    showImage(currentImageIndex);

    // Auto-advance images every 2 seconds
    setInterval(nextImage, 2000);
});
