import { CONFIG } from './config.js';
import { yearsSince, setText, prefersReducedMotion } from './utils.js';
import { Nav } from './Nav.js';
import { Lightbox } from './Lightbox.js';
import { ResumeViewer } from './ResumeViewer.js';
import { SmoothScroll } from './SmoothScroll.js';
import { ScrollFX } from './ScrollFX.js';

setText('#exp-years', yearsSince(CONFIG.experienceStart));
setText('#year', new Date().getFullYear());

new Nav();

const gallery = document.querySelector('#gallery');
const lightbox = document.querySelector('#lightbox');
if (gallery && lightbox) new Lightbox(lightbox, gallery);

const resumeModal = document.querySelector('#resume-modal');
const resumeBtn = document.querySelector('#view-resume');
if (resumeModal && resumeBtn) new ResumeViewer(resumeModal, resumeBtn);

const content = document.querySelector('#scroll-content');
const fx = new ScrollFX();
fx.collect();

// Satisfies the failsafe gate in index.html.
document.documentElement.classList.add('fx-ready');
requestAnimationFrame(() => document.body.classList.add('is-ready'));

if (prefersReducedMotion() || !content) {
    fx.settle();
} else {
    // Touch devices already have native momentum, and translating a tall layer
    // there costs more than it gives.
    const fine = window.matchMedia('(pointer: fine)').matches;
    const smooth = new SmoothScroll(content, { ease: CONFIG.scrollEase });

    smooth.onFrame(y => fx.update(y));

    if (fine) {
        document.documentElement.classList.add('smooth');
        smooth.start();
    } else {
        smooth.startPassive();
    }

    const remeasure = () => { smooth.resize(); fx.measure(smooth.current); };
    window.addEventListener('resize', remeasure, { passive: true });
    window.addEventListener('load', remeasure, { once: true });
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) img.addEventListener('load', remeasure, { once: true });
    });

    // A transformed container stops the browser resolving anchors itself.
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const docTop = target.getBoundingClientRect().top + smooth.current;
            window.scrollTo({ top: Math.max(0, docTop - CONFIG.navOffset), behavior: fine ? 'auto' : 'smooth' });
        });
    });
}
