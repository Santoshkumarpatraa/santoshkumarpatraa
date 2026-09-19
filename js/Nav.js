import { CONFIG } from './config.js';

export class Nav {
    constructor() {
        this.toggle = document.querySelector('.nav__toggle');
        this.menu = document.querySelector('.nav__menu');
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.setOpen(!this.isOpen));

        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.setOpen(false));
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isOpen) {
                this.setOpen(false);
                this.toggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > CONFIG.mobileBreakpoint) this.setOpen(false);
        });
    }

    get isOpen() {
        return this.toggle.getAttribute('aria-expanded') === 'true';
    }

    setOpen(open) {
        this.toggle.setAttribute('aria-expanded', String(open));
        this.menu.classList.toggle('is-open', open);
    }
}
