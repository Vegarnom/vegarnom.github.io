/**
 * aivan.vn - Landing Page Application
 * Optimized with security and performance fixes
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'aivan_selectedIndustry',
        ANALYTICS_ID: 'GA_MEASUREMENT_ID', // Replace with actual ID
        DEFAULT_PAGE: 'home',
        AVAILABLE_PAGES: ['home', 'services', 'results'],
        AVAILABLE_INDUSTRIES: ['beauty', 'education', 'health']
    };

    // Router Module
    const Router = {
        currentPage: CONFIG.DEFAULT_PAGE,

        /**
         * Initialize router
         */
        init() {
            this.bindEvents();
            this.handleInitialRoute();
        },

        /**
         * Bind all event listeners
         */
        bindEvents() {
            // Handle browser back/forward buttons
            window.addEventListener('popstate', (e) => {
                const page = e.state?.page || CONFIG.DEFAULT_PAGE;
                this.showPage(page, false);
            });

            // Handle hash changes for deep linking
            window.addEventListener('hashchange', () => {
                const hash = window.location.hash.replace('#', '');
                if (CONFIG.AVAILABLE_PAGES.includes(hash) && hash !== this.currentPage) {
                    this.showPage(hash, true);
                }
            });
        },

        /**
         * Handle initial route on page load
         */
        handleInitialRoute() {
            const hash = window.location.hash.replace('#', '');
            if (CONFIG.AVAILABLE_PAGES.includes(hash)) {
                this.showPage(hash, false);
            } else {
                this.showPage(CONFIG.DEFAULT_PAGE, false);
            }
        },

        /**
         * Show a specific page
         * @param {string} page - Page identifier
         * @param {boolean} pushState - Whether to update browser history
         */
        showPage(page, pushState = true) {
            // Validate page
            if (!CONFIG.AVAILABLE_PAGES.includes(page)) {
                console.warn(`[Router] Page not found: ${page}`);
                return;
            }

            const targetPage = document.getElementById(`page-${page}`);
            if (!targetPage) {
                console.warn(`[Router] Page element not found: page-${page}`);
                return;
            }

            // Hide all pages
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-hidden', 'true');
            });

            // Show target page
            targetPage.classList.add('active');
            targetPage.setAttribute('aria-hidden', 'false');
            this.currentPage = page;

            // Update URL
            if (pushState) {
                history.pushState({ page }, '', `#${page}`);
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Update page title based on current page
            this.updatePageTitle(page);

            // Track page view
            this.trackPageView(page);

            // Focus management for accessibility
            this.focusMainContent();
        },

        /**
         * Update document title based on current page
         * @param {string} page
         */
        updatePageTitle(page) {
            const titles = {
                home: 'aivan.vn - Giải pháp AI tối ưu cho doanh nghiệp',
                services: 'Chọn lĩnh vực - aivan.vn',
                results: 'Chiến lược AI - aivan.vn'
            };
            document.title = titles[page] || titles.home;
        },

        /**
         * Focus main content for screen readers
         */
        focusMainContent() {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus({ preventScroll: true });
                mainContent.removeAttribute('tabindex');
            }
        },

        /**
         * Track page view for analytics
         * @param {string} page
         */
        trackPageView(page) {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', { page_path: `/${page}` });
            }

            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'PageView');
            }

            // Custom event for other tracking
            window.dispatchEvent(new CustomEvent('pagechange', { detail: { page } }));
        }
    };

    // Industry Selection Module
    const IndustrySelector = {
        selectedIndustry: null,

        /**
         * Initialize industry selector
         */
        init() {
            this.restoreSelection();
            this.bindEvents();
        },

        /**
         * Bind event listeners
         */
        bindEvents() {
            // Listen for industry selection changes
            document.querySelectorAll('input[name="industry"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.selectIndustry(e.target.value);
                });
            });
        },

        /**
         * Select an industry
         * @param {string} industry
         */
        selectIndustry(industry) {
            if (!CONFIG.AVAILABLE_INDUSTRIES.includes(industry)) {
                console.warn(`[IndustrySelector] Invalid industry: ${industry}`);
                return;
            }

            this.selectedIndustry = industry;

            // Save to storage
            Storage.set(CONFIG.STORAGE_KEY, industry);

            // Update UI
            this.updateBreadcrumb(industry);

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'select_industry', { industry });
            }

            console.log(`[IndustrySelector] Selected: ${industry}`);
        },

        /**
         * Restore selection from storage
         */
        restoreSelection() {
            const stored = Storage.get(CONFIG.STORAGE_KEY);
            if (stored && CONFIG.AVAILABLE_INDUSTRIES.includes(stored)) {
                const radio = document.querySelector(`input[name="industry"][value="${stored}"]`);
                if (radio) {
                    radio.checked = true;
                    this.selectedIndustry = stored;
                    this.updateBreadcrumb(stored);
                }
            }
        },

        /**
         * Update breadcrumb based on selected industry
         * @param {string} industry
         */
        updateBreadcrumb(industry) {
            const names = {
                beauty: 'Làm đẹp',
                education: 'Giáo dục',
                health: 'Y tế'
            };

            const breadcrumbLink = document.querySelector('[data-breadcrumb="industry"]');
            if (breadcrumbLink) {
                breadcrumbLink.textContent = names[industry] || 'Lĩnh vực';
            }
        },

        /**
         * Get current selection
         * @returns {string|null}
         */
        getSelection() {
            return this.selectedIndustry;
        }
    };

    // Storage Module (safe wrapper)
    const Storage = {
        /**
         * Check if localStorage is available
         * @returns {boolean}
         */
        isAvailable() {
            try {
                const test = '__storage_test__';
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Get item from storage
         * @param {string} key
         * @returns {string|null}
         */
        get(key) {
            if (!this.isAvailable()) return null;
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('[Storage] Get error:', e);
                return null;
            }
        },

        /**
         * Set item in storage
         * @param {string} key
         * @param {string} value
         */
        set(key, value) {
            if (!this.isAvailable()) return;
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('[Storage] Set error:', e);
            }
        },

        /**
         * Remove item from storage
         * @param {string} key
         */
        remove(key) {
            if (!this.isAvailable()) return;
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('[Storage] Remove error:', e);
            }
        }
    };

    // Image Handler Module
    const ImageHandler = {
        /**
         * Initialize image error handling
         */
        init() {
            document.querySelectorAll('img[data-fallback]').forEach(img => {
                img.addEventListener('error', this.handleError);
            });
        },

        /**
         * Handle image load error
         * @param {Event} event
         */
        handleError(event) {
            const img = event.target;
            const fallback = img.dataset.fallback;

            if (fallback && img.src !== fallback) {
                console.warn(`[ImageHandler] Failed to load: ${img.src}, using fallback`);
                img.src = fallback;
            }

            // Remove event listener to prevent infinite loop
            img.removeEventListener('error', ImageHandler.handleError);
        }
    };

    // Accessibility Module
    const Accessibility = {
        /**
         * Initialize accessibility features
         */
        init() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
        },

        /**
         * Setup keyboard navigation
         */
        setupKeyboardNavigation() {
            // ESC to close modals or go back
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Could add modal close logic here
                }
            });
        },

        /**
         * Setup focus management
         */
        setupFocusManagement() {
            // Ensure focusable elements have visible focus
            document.querySelectorAll('a, button, [onclick]').forEach(el => {
                if (!el.hasAttribute('tabindex') && !el.matches('a[href], button, input, textarea, select')) {
                    el.setAttribute('tabindex', '0');
                    el.setAttribute('role', 'button');
                }
            });
        }
    };

    // Coming Soon Handler
    const ComingSoon = {
        /**
         * Show coming soon notice
         * @param {string} feature
         */
        show(feature = 'Tính năng') {
            // Use a non-blocking notification instead of alert
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-surface-dark border border-white/10 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up';
            notification.setAttribute('role', 'status');
            notification.setAttribute('aria-live', 'polite');
            notification.innerHTML = `
                <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">info</span>
                    ${feature} đang được phát triển
                </span>
            `;

            document.body.appendChild(notification);

            // Auto remove after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // Initialize Application
    function init() {
        // Initialize modules
        Router.init();
        IndustrySelector.init();
        ImageHandler.init();
        Accessibility.init();

        // Expose global functions (for onclick handlers)
        window.navigateTo = (page) => Router.showPage(page);
        window.selectIndustry = (industry) => IndustrySelector.selectIndustry(industry);
        window.showComingSoon = (feature) => ComingSoon.show(feature);

        // Mark as initialized
        document.documentElement.classList.add('app-initialized');

        console.log('[App] Initialized successfully');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle errors globally
    window.addEventListener('error', (e) => {
        console.error('[App] Global error:', e.message);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('[App] Unhandled rejection:', e.reason);
    });

})();
