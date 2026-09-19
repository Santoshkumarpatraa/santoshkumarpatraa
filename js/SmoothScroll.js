/**
 * Damped scrolling. The body keeps the real document height as a spacer so the
 * native scrollbar, keyboard scrolling and find-in-page still work; only the
 * content is translated to a lerped position.
 *
 * The nav and dialogs must stay outside that container — a transformed ancestor
 * breaks position: fixed.
 */
export class SmoothScroll {
    constructor(content, { ease = 0.09 } = {}) {
        this.content = content;
        this.ease = ease;
        this.current = 0;
        this.target = 0;
        this.height = 0;
        this.listeners = [];
        this.running = false;
    }

    onFrame(fn) {
        this.listeners.push(fn);
    }

    start() {
        this.resize();
        this.current = this.target = window.scrollY;

        this.ro = new ResizeObserver(() => this.resize());
        this.ro.observe(this.content);

        this.running = true;
        this.content.style.position = 'fixed';
        this.content.style.top = '0';
        this.content.style.left = '0';
        this.content.style.width = '100%';
        this.content.style.willChange = 'transform';
        document.body.classList.add('is-smooth');

        this.tick();
    }

    startPassive() {
        this.running = true;
        this.passive = true;
        this.tick();
    }

    resize() {
        // Passive mode leaves the content in normal flow; it sizes the document itself.
        if (this.passive) return;
        this.height = this.content.getBoundingClientRect().height;
        document.body.style.height = `${this.height}px`;
    }

    tick = () => {
        if (!this.running) return;

        if (this.passive) {
            this.current = window.scrollY;
        } else {
            this.target = window.scrollY;
            const delta = this.target - this.current;
            // Snap the last fraction of a pixel so it settles instead of creeping.
            this.current = Math.abs(delta) < 0.1 ? this.target : this.current + delta * this.ease;
            this.content.style.transform = `translate3d(0, ${(-this.current).toFixed(2)}px, 0)`;
        }

        for (const fn of this.listeners) fn(this.current);
        requestAnimationFrame(this.tick);
    };
}
