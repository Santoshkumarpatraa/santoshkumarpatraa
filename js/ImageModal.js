// Image Modal for Achievement Gallery
export class ImageModal {
    constructor() {
        this.modal = document.getElementById('imageModal');
        this.modalImg = document.getElementById('modalImage');
        this.closeBtn = document.querySelector('.modal-close');
        this.prevButton = document.querySelector('.modal-nav-prev');
        this.nextButton = document.querySelector('.modal-nav-next');
        this.achievementImages = Array.from(document.querySelectorAll('.achievement-image img'));
        this.currentImageIndex = -1;

        if (this.modal && this.modalImg) {
            this.init();
        } else {
            console.warn('Image modal elements not found');
        }
    }

    init() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Open modal on image click
        const achievementsBanner = document.querySelector('.achievements-banner');
        if (achievementsBanner) {
            achievementsBanner.addEventListener('click', (e) => {
                const img = e.target.closest('.achievement-image img');
                if (img) {
                    e.preventDefault();
                    this.open(img.src, img.alt, img);
                }
            });
        }

        // Close handlers
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Navigation
        if (this.prevButton) {
            this.prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPrevious();
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showNext();
            });
        }

        // Zoom on double-click
        this.modalImg.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.modalImg.classList.toggle('zoomed');
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    open(imgSrc, imgAlt, triggerElement) {
        if (!imgSrc || imgSrc.trim() === '') {
            console.warn('Cannot open modal: invalid image source');
            return;
        }

        this.currentImageIndex = this.achievementImages.findIndex(
            img => img.src === imgSrc || img === triggerElement
        );

        if (this.currentImageIndex === -1) {
            this.currentImageIndex = this.achievementImages.findIndex(img => img.src === imgSrc);
        }

        this.modalImg.src = imgSrc;
        this.modalImg.alt = imgAlt || 'Zoomed Achievement';
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.modal.setAttribute('aria-hidden', 'false');
        this.updateNavButtons();

        setTimeout(() => this.closeBtn?.focus(), 100);
    }

    close() {
        this.modal.classList.remove('active');
        this.modalImg.classList.remove('zoomed');
        document.body.style.overflow = '';
        this.modal.setAttribute('aria-hidden', 'true');
        this.currentImageIndex = -1;

        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('.achievement-image')) {
            activeElement.focus();
        }
    }

    showPrevious() {
        if (this.currentImageIndex <= 0 || this.achievementImages.length === 0) return;
        this.currentImageIndex--;
        this.updateImage();
    }

    showNext() {
        if (this.currentImageIndex >= this.achievementImages.length - 1 || 
            this.achievementImages.length === 0) return;
        this.currentImageIndex++;
        this.updateImage();
    }

    updateImage() {
        const img = this.achievementImages[this.currentImageIndex];
        this.modalImg.src = img.src;
        this.modalImg.alt = img.alt || 'Zoomed Achievement';
        this.modalImg.classList.remove('zoomed');
        this.updateNavButtons();
    }

    updateNavButtons() {
        if (this.achievementImages.length <= 1) {
            this.prevButton?.classList.add('hidden');
            this.nextButton?.classList.add('hidden');
            return;
        }

        if (this.prevButton) {
            this.prevButton.classList.toggle('hidden', this.currentImageIndex <= 0);
        }

        if (this.nextButton) {
            this.nextButton.classList.toggle(
                'hidden',
                this.currentImageIndex >= this.achievementImages.length - 1
            );
        }
    }

    handleKeyboard(e) {
        if (!this.modal.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.showPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.showNext();
                break;
        }
    }
}
