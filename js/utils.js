/** Whole and half years since `startDate`, rendered as "3+" / "3.5+". */
export function yearsSince(startDate) {
    const years = (Date.now() - new Date(startDate)) / (1000 * 60 * 60 * 24 * 365.25);
    const halves = Math.floor(years * 2) / 2;
    return `${Number.isInteger(halves) ? halves : halves.toFixed(1)}+`;
}

export function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
}

export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
