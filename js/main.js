// Main Application Entry Point
import { CONFIG } from './config.js';
import { calculateExperience, updateExperienceText, updateCurrentYear } from './utils.js';
import { Navigation } from './Navigation.js';
import { ContactHandler } from './ContactHandler.js';
import { ImageModal } from './ImageModal.js';
import { PDFViewer } from './PDFViewer.js';
import { ScrollAnimation } from './ScrollAnimation.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize utilities
    const experienceText = calculateExperience(CONFIG.experience.startDate);
    updateExperienceText(experienceText, CONFIG.experience.selectors);
    updateCurrentYear();

    // Initialize modules
    new Navigation();
    new ContactHandler();
    new ImageModal();
    new PDFViewer();
    new ScrollAnimation();
});
