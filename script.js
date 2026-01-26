// Calculate Years of Experience
function calculateExperience() {
    const startDate = new Date('2022-11-01');
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const diffTime = currentDate - startDate;

    // Convert to years (accounting for leap years)
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

    // Format the experience
    let experienceText;

    if (diffYears < 3.5) {
        experienceText = '3+';
    } else if (diffYears < 4.0) {
        experienceText = '3.5+';
    } else if (diffYears < 4.5) {
        experienceText = '4+';
    } else if (diffYears < 5.0) {
        experienceText = '4.5+';
    } else {
        // For 5+ years, round to nearest 0.5
        const roundedYears = Math.floor(diffYears * 2) / 2;
        if (roundedYears === Math.floor(roundedYears)) {
            experienceText = Math.floor(roundedYears) + '+';
        } else {
            experienceText = roundedYears + '+';
        }
    }

    // Update all experience elements
    const experienceElements = document.querySelectorAll('#experience-years, #experience-years-about');
    experienceElements.forEach(element => {
        if (element) {
            element.textContent = experienceText;
        }
    });
}

// Update Current Year
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Navigation Dropdown Toggle
document.addEventListener('DOMContentLoaded', function () {
    // Calculate and display experience
    calculateExperience();

    // Update current year
    updateCurrentYear();
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navDropdown = document.querySelector('.nav-dropdown');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Dropdown functionality
    if (dropdownToggle && navDropdown) {
        const handleDropdownToggle = function (e) {
            e.preventDefault();
            e.stopPropagation();
            navDropdown.classList.toggle('active');
        };

        // Support both click and touch events for mobile
        dropdownToggle.addEventListener('click', handleDropdownToggle);
        dropdownToggle.addEventListener('touchend', function (e) {
            e.preventDefault();
            handleDropdownToggle(e);
        });

        // Close dropdown when clicking outside (but not on mobile menu items)
        document.addEventListener('click', function (e) {
            if (!navDropdown.contains(e.target) && !navMenu.contains(e.target)) {
                navDropdown.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        const dropdownMenu = navDropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link (but not dropdown toggle)
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Don't close menu if clicking dropdown toggle
                if (!this.classList.contains('dropdown-toggle')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#projects') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Debounce function for performance
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Close dropdown on window resize (mobile) - debounced for performance
    const handleResize = debounce(() => {
        if (window.innerWidth > 768) {
            navDropdown?.classList.remove('active');
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }, 250);
    window.addEventListener('resize', handleResize);

    // Make contact items clickable - prevent accidental clicks during scrolling
    const contactItems = document.querySelectorAll('.contact-item[data-href]');

    // Track if user is scrolling
    let isScrolling = false;
    let scrollTimer = null;

    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isScrolling = false;
        }, 200); // Wait 200ms after scroll stops
    }, { passive: true });

    contactItems.forEach(item => {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchMoved = false;

        // Track touch start position
        item.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchMoved = false;
        }, { passive: true });

        // Track if touch moved (indicating scroll)
        item.addEventListener('touchmove', function (e) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);

            // If moved more than 5px, consider it a scroll
            if (deltaX > 5 || deltaY > 5) {
                touchMoved = true;
            }
        }, { passive: true });

        // Handle click/tap
        const handleContactClick = function (e) {
            // Don't trigger if user is scrolling or touch moved
            if (isScrolling || touchMoved) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // For touch events, check movement
            if (e.type === 'touchend') {
                if (touchMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                e.preventDefault();
            }

            const href = this.getAttribute('data-href');
            const target = this.getAttribute('data-target');

            if (href) {
                if (target === '_blank') {
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = href;
                }
            }
        };

        // Use click for mouse (with scroll check)
        item.addEventListener('click', function (e) {
            if (isScrolling) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            handleContactClick.call(this, e);
        });

        // Use touchend for touch devices
        item.addEventListener('touchend', handleContactClick);
    });

    // Smooth Scroll Animations on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections and header
    const sections = document.querySelectorAll('.section, .header');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Image Zoom Modal Functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.modal-close');
    const prevButton = document.querySelector('.modal-nav-prev');
    const nextButton = document.querySelector('.modal-nav-next');

    if (!modal || !modalImg) {
        console.warn('Modal elements not found');
    } else {
        // Get all achievement images
        const achievementImages = Array.from(document.querySelectorAll('.achievement-image img'));
        let currentImageIndex = -1;

        // Update navigation arrows visibility
        const updateNavButtons = () => {
            if (achievementImages.length <= 1) {
                // Hide arrows if only one image or no images
                prevButton?.classList.add('hidden');
                nextButton?.classList.add('hidden');
                return;
            }

            // Show/hide prev button
            if (prevButton) {
                if (currentImageIndex <= 0) {
                    prevButton.classList.add('hidden');
                } else {
                    prevButton.classList.remove('hidden');
                }
            }

            // Show/hide next button
            if (nextButton) {
                if (currentImageIndex >= achievementImages.length - 1) {
                    nextButton.classList.add('hidden');
                } else {
                    nextButton.classList.remove('hidden');
                }
            }
        };

        // Helper function to close modal
        const closeModalFn = () => {
            modal.classList.remove('active');
            modalImg.classList.remove('zoomed');
            document.body.style.overflow = '';
            modal.setAttribute('aria-hidden', 'true');
            currentImageIndex = -1;
            // Return focus to the element that opened the modal
            const activeElement = document.activeElement;
            if (activeElement && activeElement.closest('.achievement-image')) {
                activeElement.focus();
            }
        };

        // Helper function to open modal
        const openModalFn = (imgSrc, imgAlt, triggerElement) => {
            if (!imgSrc || imgSrc.trim() === '') {
                console.warn('Cannot open modal: invalid image source');
                return;
            }

            // Find the index of the clicked image
            currentImageIndex = achievementImages.findIndex(img => img.src === imgSrc || img === triggerElement);
            if (currentImageIndex === -1) {
                currentImageIndex = achievementImages.findIndex(img => img.src === imgSrc);
            }

            modalImg.src = imgSrc;
            modalImg.alt = imgAlt || 'Zoomed Achievement';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            modal.setAttribute('aria-hidden', 'false');
            updateNavButtons(); // Update arrow visibility
            // Focus close button for accessibility
            setTimeout(() => closeModal?.focus(), 100);
        };

        // Navigate to previous image
        const showPreviousImage = () => {
            if (currentImageIndex <= 0 || achievementImages.length === 0) return;
            currentImageIndex--;
            const prevImg = achievementImages[currentImageIndex];
            modalImg.src = prevImg.src;
            modalImg.alt = prevImg.alt || 'Zoomed Achievement';
            modalImg.classList.remove('zoomed'); // Reset zoom when changing images
            updateNavButtons(); // Update arrow visibility
        };

        // Navigate to next image
        const showNextImage = () => {
            if (currentImageIndex >= achievementImages.length - 1 || achievementImages.length === 0) return;
            currentImageIndex++;
            const nextImg = achievementImages[currentImageIndex];
            modalImg.src = nextImg.src;
            modalImg.alt = nextImg.alt || 'Zoomed Achievement';
            modalImg.classList.remove('zoomed'); // Reset zoom when changing images
            updateNavButtons(); // Update arrow visibility
        };

        // Use event delegation for achievement images (better performance)
        const achievementsBanner = document.querySelector('.achievements-banner');
        if (achievementsBanner) {
            achievementsBanner.addEventListener('click', function (e) {
                const img = e.target.closest('.achievement-image img');
                if (img) {
                    e.preventDefault();
                    openModalFn(img.src, img.alt, img);
                }
            });
        }

        // Close modal handlers
        if (closeModal) {
            closeModal.addEventListener('click', closeModalFn);
        }

        // Navigation button handlers
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showPreviousImage();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showNextImage();
            });
        }

        // Close modal when clicking outside the image (on background)
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModalFn();
            }
        });

        // Toggle zoom on image double-click (better UX than single click)
        modalImg.addEventListener('dblclick', function (e) {
            e.stopPropagation();
            this.classList.toggle('zoomed');
        });

        // Keyboard navigation handler
        const handleKeyboard = (e) => {
            if (!modal.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    closeModalFn();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    showNextImage();
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyboard);
    }

    // PDF Viewer Modal Functionality
    const pdfModal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const pdfCloseBtn = pdfModal?.querySelector('.modal-close');
    // Use local PDF file for viewing (faster and more reliable)
    const localPdfPath = './Santosh_Resume_ATS.pdf';
    // GitHub URL for download (kept for deployed version)
    const resumePdfUrl = 'https://raw.githubusercontent.com/Santoshkumarpatraa/santoshkumarpatraa/main/Santosh_Resume_ATS.pdf';
    let pdfBlobUrl = null;

    if (viewResumeBtn && pdfModal && pdfViewer) {
        // Open PDF modal
        viewResumeBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Show loading state
            pdfModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            pdfModal.setAttribute('aria-hidden', 'false');

            try {
                // Try local file first (faster, no download headers)
                let response = await fetch(localPdfPath);

                // If local file not found (e.g., in production), use GitHub URL
                if (!response.ok) {
                    response = await fetch(resumePdfUrl);
                    if (!response.ok) {
                        throw new Error('Failed to fetch PDF');
                    }
                }

                const blob = await response.blob();

                // Create object URL from blob to prevent download
                if (pdfBlobUrl) {
                    URL.revokeObjectURL(pdfBlobUrl);
                }
                pdfBlobUrl = URL.createObjectURL(blob);

                // Set the blob URL to the object tag
                pdfViewer.data = pdfBlobUrl;

                setTimeout(() => pdfCloseBtn?.focus(), 100);
            } catch (error) {
                console.error('Error loading PDF:', error);
                // Fallback: use direct path
                pdfViewer.data = localPdfPath;
                setTimeout(() => pdfCloseBtn?.focus(), 100);
            }
        });

        // Close PDF modal
        const closePdfModal = () => {
            pdfModal.classList.remove('active');
            pdfViewer.data = '';

            // Clean up blob URL to free memory
            if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
                pdfBlobUrl = null;
            }

            document.body.style.overflow = '';
            pdfModal.setAttribute('aria-hidden', 'true');
        };

        if (pdfCloseBtn) {
            pdfCloseBtn.addEventListener('click', closePdfModal);
        }

        // Close modal when clicking outside
        pdfModal.addEventListener('click', function (e) {
            if (e.target === pdfModal) {
                closePdfModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
                closePdfModal();
            }
        });
    }
});

