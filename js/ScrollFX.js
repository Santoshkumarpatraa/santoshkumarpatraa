const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = p => 1 - Math.pow(1 - p, 3);

/**
 * Positions are measured once per resize so each frame is pure arithmetic -
 * no layout reads in the loop. Effects are driven by progress rather than fired
 * once, so they also run in reverse when scrolling back up.
 */
export class ScrollFX {
    constructor() {
        this.items = [];
        this.vh = window.innerHeight;
    }

    collect() {
        this.items = [...document.querySelectorAll('[data-fx]')].map(el => ({
            el,
            type: el.dataset.fx,
            amount: parseFloat(el.dataset.fxAmount || '0'),
            to: parseFloat(el.dataset.fxTo || '0'),
            delay: parseFloat(el.dataset.fxDelay || '0'),
            length: parseFloat(el.dataset.fxLength || '1'),
            from: parseFloat(el.dataset.fxFrom || '0'),
            until: parseFloat(el.dataset.fxUntil || '1'),
            progress: 0,
            top: 0,
            height: 0
        }));

        // A stage child reads its pin's progress, so pins must update first.
        for (const it of this.items) {
            if (it.type === 'stage' || it.type === 'stageOut') it.pin = this.items.find(p => p.type === 'pin' && p.el.contains(it.el));
        }
        this.items.sort((a, b) => (a.type === 'pin' ? -1 : 0) - (b.type === 'pin' ? -1 : 0));

        this.sections = [...document.querySelectorAll('main section, main header')]
            .filter(el => el.id)
            .map(el => ({ el, id: el.id, dot: document.querySelector(`.dots a[href="#${el.id}"]`), top: 0, height: 0 }));

        this.measure();
    }

    /** @param {number} [scrollOffset] the translation actually applied - under
     *  damping this lags window.scrollY, and the wrong one skews every measurement. */
    measure(scrollOffset) {
        this.vh = window.innerHeight;
        // Below this width the CSS lets the hero flow, so pinning would overlap
        // the section beneath it.
        this.allowPin = window.innerWidth > 900;
        const offset = scrollOffset ?? window.scrollY;
        for (const it of this.items) {
            // Undo any applied pin offset to get the natural position.
            const applied = it.type === 'pin' ? (it.offset || 0) : 0;
            const r = it.el.getBoundingClientRect();
            it.top = r.top + offset - applied;
            it.height = r.height;
        }
        for (const sec of this.sections || []) {
            const r = sec.el.getBoundingClientRect();
            sec.top = r.top + offset;
            sec.height = r.height;
        }
    }

    band(scrollY, from, to) {
        return clamp((scrollY - from) / (to - from || 1));
    }

    update(scrollY) {
        const vh = this.vh;

        for (const it of this.items) {
            const { el, type } = it;

            if (type === 'rise' || type === 'wipe') {
                const stagger = it.delay * vh * 0.12;
                const from = it.top - vh * 0.92 + stagger;
                const to = it.top - vh * 0.5 + stagger;
                const p = easeOut(this.band(scrollY, from, to));

                el.style.opacity = p;
                if (type === 'wipe') {
                    el.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
                    el.style.transform = `translate3d(0, ${((1 - p) * 26).toFixed(2)}px, 0)`;
                } else {
                    el.style.transform = `translate3d(0, ${((1 - p) * 34).toFixed(2)}px, 0)`;
                }
            }

            else if (type === 'parallax') {
                const p = this.band(scrollY, it.top - vh, it.top + it.height);
                el.style.transform = `translate3d(0, ${((p - 0.5) * it.amount * -2).toFixed(2)}px, 0) scale(1.07)`;
            }

            else if (type === 'count') {
                const from = it.top - vh * 0.95;
                const to = it.top - vh * 0.45;
                const p = easeOut(this.band(scrollY, from, to));
                el.textContent = String(Math.round(it.to * p));
            }

            else if (type === 'pin') {
                if (!this.allowPin) {
                    it.offset = 0;
                    it.progress = 1;
                    el.style.transform = '';
                    continue;
                }
                // The wrapper is translated by -scrollY; adding the travelled
                // distance back holds this element still on screen.
                const span = it.length * vh;
                const offset = clamp(scrollY - it.top, 0, span);
                it.offset = offset;
                it.progress = clamp((scrollY - it.top) / (span || 1));
                el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
            }

            else if (type === 'stage' && !this.allowPin) {
                const p = easeOut(this.band(scrollY, it.top - vh * 0.92, it.top - vh * 0.5));
                el.style.opacity = p;
                el.style.transform = `translate3d(0, ${((1 - p) * 34).toFixed(2)}px, 0)`;
                if (el.dataset.fxWipe !== undefined) el.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
            }

            else if (type === 'stageOut' && !this.allowPin) {
                el.style.opacity = 1;
                el.style.transform = 'none';
            }

            else if (type === 'stage') {
                const pp = it.pin ? it.pin.progress : 0;
                const p = easeOut(clamp((pp - it.from) / ((it.until - it.from) || 1)));
                el.style.opacity = p;
                el.style.transform = `translate3d(0, ${((1 - p) * 40).toFixed(2)}px, 0)`;
                if (el.dataset.fxWipe !== undefined) {
                    el.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
                }
            }

            else if (type === 'stageOut') {
                const pp = it.pin ? it.pin.progress : 0;
                const p = easeOut(clamp((pp - it.from) / ((it.until - it.from) || 1)));
                el.style.opacity = (1 - p).toFixed(3);
                el.style.transform = `translate3d(0, ${(p * -60).toFixed(2)}px, 0) scale(${(1 - p * 0.05).toFixed(4)})`;
            }

            else if (type === 'focus') {
                const centre = it.top + it.height / 2 - scrollY - vh / 2;
                const d = Math.min(1, Math.abs(centre) / (vh * 0.42));
                el.style.opacity = (1 - d * 0.72).toFixed(3);
            }

            else if (type === 'drift') {
                const p = easeOut(this.band(scrollY, it.top - vh, it.top + it.height * 0.4));
                const away = 1 - p;
                el.style.transform =
                    `translate3d(${(away * it.amount).toFixed(2)}px, ${(away * it.amount * 0.55).toFixed(2)}px, 0)` +
                    ` rotate(${(away * it.to).toFixed(2)}deg)`;
                el.style.opacity = Math.min(1, p * 1.6).toFixed(3);
            }

            else if (type === 'rail') {
                const p = this.band(scrollY, 0, Math.max(1, document.body.scrollHeight - vh));
                el.style.transform = `scaleY(${p.toFixed(4)})`;
            }
        }

        this.updateSections(scrollY);
    }

    updateSections(scrollY) {
        if (!this.sections) return;
        const mid = scrollY + this.vh * 0.5;
        let active = null;
        for (const sec of this.sections) {
            if (mid >= sec.top) active = sec;
        }
        for (const sec of this.sections) {
            sec.dot?.classList.toggle('is-active', sec === active);
        }
        document.body.classList.toggle('is-scrolled', scrollY > this.vh * 0.6);
    }

    /** Resting state, for reduced motion. */
    settle() {
        for (const { el, type, to } of this.items) {
            if (type === 'count') {
                el.textContent = String(to);
            } else if (type !== 'rail' && type !== 'pin') {
                el.style.opacity = 1;
                el.style.transform = 'none';
                el.style.clipPath = 'none';
            }
        }
    }
}
