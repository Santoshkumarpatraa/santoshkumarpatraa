// Scroll Animation using Intersection Observer
import { CONFIG } from './config.js';

export class ScrollAnimation {
    constructor() {
        this.observerOptions = {
            threshold: CONFIG.animation.intersectionThreshold,
            rootMargin: CONFIG.animation.intersectionRootMargin
        };
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);

        // Observe all sections and header
        const sections = document.querySelectorAll('.section, .header');
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}
