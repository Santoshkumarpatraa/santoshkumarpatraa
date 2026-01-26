// Utility Functions

/**
 * Debounce function to limit function execution frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Calculate years of experience from start date
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @returns {string} Formatted experience text (e.g., "3+", "3.5+")
 */
export function calculateExperience(startDate) {
    const start = new Date(startDate);
    const current = new Date();
    const diffTime = current - start;
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

    if (diffYears < 3.5) return '3+';
    if (diffYears < 4.0) return '3.5+';
    if (diffYears < 4.5) return '4+';
    if (diffYears < 5.0) return '4.5+';

    const roundedYears = Math.floor(diffYears * 2) / 2;
    return roundedYears === Math.floor(roundedYears)
        ? `${Math.floor(roundedYears)}+`
        : `${roundedYears}+`;
}

/**
 * Update experience text in DOM elements
 * @param {string} experienceText - Experience text to display
 * @param {string[]} selectors - Array of CSS selectors
 */
export function updateExperienceText(experienceText, selectors) {
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.textContent = experienceText;
            }
        });
    });
}

/**
 * Update current year in footer
 * @param {string} selector - CSS selector for year element
 */
export function updateCurrentYear(selector = '#current-year') {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = new Date().getFullYear();
    }
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector for target element
 * @param {number} offset - Offset from top in pixels
 */
export function smoothScrollTo(selector, offset = 0) {
    const target = document.querySelector(selector);
    if (target) {
        const offsetTop = target.offsetTop - offset;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}
