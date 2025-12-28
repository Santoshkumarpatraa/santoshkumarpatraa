// Calculate Years of Experience
function calculateExperience() {
    const startDate = new Date('2022-11-01');
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const diffTime = currentDate - startDate;
    
    // Convert to years (accounting for leap years)
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    
    // Format the experience
    let experienceText;
    
    if (diffYears < 3.5) {
        experienceText = '3+';
    } else if (diffYears < 4.0) {
        experienceText = '3.5+';
    } else if (diffYears < 4.5) {
        experienceText = '4+';
    } else if (diffYears < 5.0) {
        experienceText = '4.5+';
    } else {
        // For 5+ years, round to nearest 0.5
        const roundedYears = Math.floor(diffYears * 2) / 2;
        if (roundedYears === Math.floor(roundedYears)) {
            experienceText = Math.floor(roundedYears) + '+';
        } else {
            experienceText = roundedYears + '+';
        }
    }
    
    // Update all experience elements
    const experienceElements = document.querySelectorAll('#experience-years, #experience-years-about');
    experienceElements.forEach(element => {
        if (element) {
            element.textContent = experienceText;
        }
    });
}

// Update Current Year
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Navigation Dropdown Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Calculate and display experience
    calculateExperience();
    
    // Update current year
    updateCurrentYear();
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navDropdown = document.querySelector('.nav-dropdown');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Dropdown functionality
    if (dropdownToggle && navDropdown) {
        const handleDropdownToggle = function(e) {
            e.preventDefault();
            e.stopPropagation();
            navDropdown.classList.toggle('active');
        };

        // Support both click and touch events for mobile
        dropdownToggle.addEventListener('click', handleDropdownToggle);
        dropdownToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleDropdownToggle(e);
        });

        // Close dropdown when clicking outside (but not on mobile menu items)
        document.addEventListener('click', function(e) {
            if (!navDropdown.contains(e.target) && !navMenu.contains(e.target)) {
                navDropdown.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        const dropdownMenu = navDropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link (but not dropdown toggle)
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't close menu if clicking dropdown toggle
                if (!this.classList.contains('dropdown-toggle')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#projects') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close dropdown on window resize (mobile)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navDropdown.classList.remove('active');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Make contact items clickable
    const contactItems = document.querySelectorAll('.contact-item[data-href]');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const href = this.getAttribute('data-href');
            const target = this.getAttribute('data-target');
            
            if (href) {
                if (target === '_blank') {
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = href;
                }
            }
        });

        // Support touch events for mobile
        item.addEventListener('touchend', function(e) {
            e.preventDefault();
            const href = this.getAttribute('data-href');
            const target = this.getAttribute('data-target');
            
            if (href) {
                if (target === '_blank') {
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = href;
                }
            }
        });
    });
});

