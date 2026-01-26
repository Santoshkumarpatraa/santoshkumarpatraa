// PDF Viewer Modal
import { CONFIG } from './config.js';

export class PDFViewer {
    constructor() {
        this.modal = document.getElementById('pdfModal');
        this.viewer = document.getElementById('pdfViewer');
        this.viewBtn = document.getElementById('view-resume-btn');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.pdfBlobUrl = null;

        if (this.viewBtn && this.modal && this.viewer) {
            this.init();
        }
    }

    init() {
        this.initEventListeners();
    }

    initEventListeners() {
        this.viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.open();
        });

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    async open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.modal.setAttribute('aria-hidden', 'false');

        try {
            // Try local file first
            let response = await fetch(CONFIG.pdf.local);

            // Fallback to remote URL
            if (!response.ok) {
                response = await fetch(CONFIG.pdf.remote);
                if (!response.ok) {
                    throw new Error('Failed to fetch PDF');
                }
            }

            const blob = await response.blob();

            // Clean up previous blob URL
            if (this.pdfBlobUrl) {
                URL.revokeObjectURL(this.pdfBlobUrl);
            }

            this.pdfBlobUrl = URL.createObjectURL(blob);
            this.viewer.data = this.pdfBlobUrl;

            setTimeout(() => this.closeBtn?.focus(), 100);
        } catch (error) {
            console.error('Error loading PDF:', error);
            // Fallback: use direct path
            this.viewer.data = CONFIG.pdf.local;
            setTimeout(() => this.closeBtn?.focus(), 100);
        }
    }

    close() {
        this.modal.classList.remove('active');
        this.viewer.data = '';

        // Clean up blob URL
        if (this.pdfBlobUrl) {
            URL.revokeObjectURL(this.pdfBlobUrl);
            this.pdfBlobUrl = null;
        }

        document.body.style.overflow = '';
        this.modal.setAttribute('aria-hidden', 'true');
    }
}
