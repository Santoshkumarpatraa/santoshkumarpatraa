import { Modal } from './Modal.js';

export class Lightbox extends Modal {
    constructor(root, gallery) {
        super(root);
        this.img = root.querySelector('#lightbox-img');
        this.caption = root.querySelector('#lightbox-caption');
        this.prevBtn = root.querySelector('[data-prev]');
        this.nextBtn = root.querySelector('[data-next]');

        this.items = [...gallery.querySelectorAll('.shot')].map(btn => ({
            trigger: btn,
            src: btn.querySelector('img').src,
            alt: btn.querySelector('img').alt,
            label: btn.querySelector('span').textContent
        }));

        this.index = 0;

        this.items.forEach((item, i) => {
            item.trigger.addEventListener('click', () => {
                this.index = i;
                this.open();
            });
        });

        this.prevBtn.addEventListener('click', () => this.step(-1));
        this.nextBtn.addEventListener('click', () => this.step(1));

        this.root.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') this.step(-1);
            if (e.key === 'ArrowRight') this.step(1);
        });
    }

    step(delta) {
        const next = this.index + delta;
        if (next < 0 || next >= this.items.length) return;
        this.index = next;
        this.render();
    }

    render() {
        const item = this.items[this.index];
        this.img.src = item.src;
        this.img.alt = item.alt;
        this.caption.textContent = `${item.label} — ${this.index + 1} of ${this.items.length}`;
        this.prevBtn.disabled = this.index === 0;
        this.nextBtn.disabled = this.index === this.items.length - 1;
    }

    onOpen() {
        this.render();
    }

    onClose() {
        // Return focus to the thumbnail that opened this view, not the page top.
        this.lastFocused = this.items[this.index].trigger;
    }
}
