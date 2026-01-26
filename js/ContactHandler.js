// Contact Items Handler - Prevents accidental clicks during scrolling
import { CONFIG } from './config.js';

export class ContactHandler {
    constructor() {
        this.contactItems = document.querySelectorAll('.contact-item[data-href]');
        this.isScrolling = false;
        this.scrollTimer = null;
        
        this.init();
    }

    init() {
        this.initScrollDetection();
        this.initContactItems();
    }

    initScrollDetection() {
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => {
                this.isScrolling = false;
            }, CONFIG.scroll.debounceDelay);
        }, { passive: true });
    }

    initContactItems() {
        this.contactItems.forEach(item => {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchMoved = false;

            // Track touch start
            item.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchMoved = false;
            }, { passive: true });

            // Track touch movement
            item.addEventListener('touchmove', (e) => {
                const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
                const deltaY = Math.abs(e.touches[0].clientY - touchStartY);

                if (deltaX > CONFIG.scroll.touchMoveThreshold || 
                    deltaY > CONFIG.scroll.touchMoveThreshold) {
                    touchMoved = true;
                }
            }, { passive: true });

            // Handle click
            const handleClick = (e) => {
                if (this.isScrolling || touchMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                if (e.type === 'touchend' && touchMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                if (e.type === 'touchend') {
                    e.preventDefault();
                }

                const href = item.getAttribute('data-href');
                const target = item.getAttribute('data-target');

                if (href) {
                    if (target === '_blank') {
                        window.open(href, '_blank', 'noopener,noreferrer');
                    } else {
                        window.location.href = href;
                    }
                }
            };

            item.addEventListener('click', handleClick);
            item.addEventListener('touchend', handleClick);
        });
    }
}
