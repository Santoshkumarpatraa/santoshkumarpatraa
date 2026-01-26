// Navigation Module
import { CONFIG } from './config.js';
import { debounce } from './utils.js';

export class Navigation {
    constructor() {
        this.dropdownToggle = document.querySelector('.dropdown-toggle');
        this.navDropdown = document.querySelector('.nav-dropdown');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.initDropdown();
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initResizeHandler();
    }

    initDropdown() {
        if (!this.dropdownToggle || !this.navDropdown) return;

        const handleToggle = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.navDropdown.classList.toggle('active');
        };

        this.dropdownToggle.addEventListener('click', handleToggle);
        this.dropdownToggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleToggle(e);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navDropdown.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.navDropdown.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside
        const dropdownMenu = this.navDropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    initMobileMenu() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.classList.contains('dropdown-toggle')) {
                    this.hamburger.classList.remove('active');
                    this.navMenu.classList.remove('active');
                }
            });
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href !== '#projects') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - CONFIG.animation.navbarOffset;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    initResizeHandler() {
        const handleResize = debounce(() => {
            if (window.innerWidth > CONFIG.breakpoints.mobile) {
                this.navDropdown?.classList.remove('active');
                this.hamburger?.classList.remove('active');
                this.navMenu?.classList.remove('active');
            }
        }, CONFIG.debounce.resize);

        window.addEventListener('resize', handleResize);
    }
}
