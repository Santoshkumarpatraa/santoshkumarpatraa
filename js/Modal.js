const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])';

export class Modal {
    constructor(root) {
        this.root = root;
        this.lastFocused = null;

        this.root.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        this.root.addEventListener('click', e => {
            if (e.target === this.root) this.close();
        });

        // On the document, not the dialog: a backdrop click can move focus out.
        document.addEventListener('keydown', e => {
            if (!this.isOpen) return;
            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }

    get isOpen() {
        return !this.root.hidden;
    }

    trapFocus(e) {
        const items = [...this.root.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
        if (!items.length) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    open() {
        this.lastFocused = document.activeElement;
        this.root.hidden = false;
        document.body.classList.add('is-locked');
        this.onOpen();
        this.root.querySelector('[data-close]')?.focus();
    }

    close() {
        if (!this.isOpen) return;
        this.root.hidden = true;
        document.body.classList.remove('is-locked');
        this.onClose();
        this.lastFocused?.focus();
        this.lastFocused = null;
    }

    onOpen() { }
    onClose() { }
}
