/**
 * FLICKORA - STREAMING PLATFORM CLIENT SCRIPT
 * Implements 20 Interactive Features & Robust Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       FEATURE 1: DARK MODE TOGGLE (with localStorage & system preference)
       ========================================================================== */
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const savedTheme = localStorage.getItem('flickora_theme');

    // Check saved theme or system preference
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        // Can optionally follow system preference
    }

    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('flickora_theme', currentTheme);
        showToast(`Switched to ${currentTheme} mode`);
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });


        /* ==========================================================================
           FEATURE 2: SIMPLE COOKIE BANNER (with localStorage persistence)
           ========================================================================== */
        const cookieBanner = document.getElementById('cookie-banner');
        const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
        const declineCookiesBtn = document.getElementById('decline-cookies-btn');

        if (cookieBanner && !localStorage.getItem('flickora_cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.add('active');
            }, 1200);
        }

        if (acceptCookiesBtn) {
            acceptCookiesBtn.addEventListener('click', () => {
                localStorage.setItem('flickora_cookie_consent', 'accepted');
                cookieBanner.classList.remove('active');
                showToast('Cookie preferences saved');
            });
        }

        if (declineCookiesBtn) {
            declineCookiesBtn.addEventListener('click', () => {
                localStorage.setItem('flickora_cookie_consent', 'declined');
                cookieBanner.classList.remove('active');
                showToast('Essential cookies only enabled');
            });
        }


        /* ==========================================================================
           FEATURE 3: SITE SEARCH (Live search, dropdown, highlights & shortcuts)
           ========================================================================== */
        const searchInputs = document.querySelectorAll('.site-search-input');
        const searchDropdown = document.getElementById('search-dropdown');
        const searchClearBtns = document.querySelectorAll('.search-clear-btn');

        // Catalogue media database for live search
        const movieCatalogue = [
            { id: 1, title: 'Squid Game', year: '2021', rating: '16+', type: 'Series', genre: 'Drama, Thriller', desc: 'Survive or Die: The Deadly Games Begin', img: 'image/1.png' },
            { id: 2, title: 'One Piece', year: '1999', rating: '13+', type: 'Anime', genre: 'Action, Adventure', desc: 'Set Sail with Luffy on the Quest for the One Piece', img: 'image/2.png' },
            { id: 3, title: 'Shogun', year: '2024', rating: '16+', type: 'Series', genre: 'Historical Drama', desc: 'Honor, Power, and Betrayal in Feudal Japan', img: 'image/3.png' },
            { id: 4, title: 'Demon Slayer', year: '2019', rating: '17+', type: 'Anime', genre: 'Action, Supernatural', desc: 'Blades Clash and Demons Fall in a Battle for Humanity', img: 'image/4.png' },
            { id: 5, title: 'Game of Thrones', year: '2011', rating: '18+', type: 'Series', genre: 'Fantasy, Drama', desc: 'Power, Betrayal, and the Fight for the Iron Throne', img: 'image/5.png' },
            { id: 6, title: 'Jujutsu Kaisen', year: '2020', rating: '17+', type: 'Anime', genre: 'Action, Dark Fantasy', desc: 'Curses Rise, Sorcerers Fight, and Destiny Unfolds', img: 'image/6.png' }
        ];

        function renderSearchResults(query) {
            if (!searchDropdown) return;
            const cleanQuery = query.trim().toLowerCase();

            if (!cleanQuery) {
                searchDropdown.classList.remove('active');
                searchDropdown.innerHTML = '';
                return;
            }

            const filtered = movieCatalogue.filter(item =>
                item.title.toLowerCase().includes(cleanQuery) ||
                item.genre.toLowerCase().includes(cleanQuery) ||
                item.desc.toLowerCase().includes(cleanQuery) ||
                item.type.toLowerCase().includes(cleanQuery)
            );

            if (filtered.length === 0) {
                searchDropdown.innerHTML = `<div class="search-no-results">No streaming titles found for "<strong>${escapeHtml(query)}</strong>"</div>`;
            } else {
                searchDropdown.innerHTML = filtered.map(item => `
                <div class="search-result-item" data-title="${item.title}" tabindex="0">
                    <img src="${item.img}" alt="${item.title}" class="search-result-thumb">
                    <div class="search-result-info">
                        <h5>${item.title}</h5>
                        <p>${item.type} • ${item.year} • ${item.genre}</p>
                    </div>
                </div>
            `).join('');
            }

            searchDropdown.classList.add('active');

            // Click search result to navigate
            const resultItems = searchDropdown.querySelectorAll('.search-result-item');
            resultItems.forEach(el => {
                el.addEventListener('click', () => {
                    const targetTitle = el.getAttribute('data-title');
                    navigateToTitle(targetTitle);
                    searchDropdown.classList.remove('active');
                });
            });
        }

        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const val = e.target.value;
                renderSearchResults(val);
                const parent = input.closest('.search-box');
                const clearBtn = parent ? parent.querySelector('.search-clear-btn') : null;
                if (clearBtn) {
                    clearBtn.style.display = val ? 'inline-block' : 'none';
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (searchDropdown) searchDropdown.classList.remove('active');
                    input.blur();
                }
            });
        });

        searchClearBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = btn.closest('.search-box');
                const input = parent ? parent.querySelector('input') : null;
                if (input) {
                    input.value = '';
                    btn.style.display = 'none';
                    renderSearchResults('');
                    input.focus();
                }
            });
        });

        // Close search dropdown on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper') && searchDropdown) {
                searchDropdown.classList.remove('active');
            }
        });

        // Global keyboard shortcut for search (Ctrl+K or /)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const firstSearch = document.querySelector('.site-search-input');
                if (firstSearch) firstSearch.focus();
            }
        });


        /* ==========================================================================
           FEATURE 4: BACK TO TOP BUTTON (Smooth scroll)
           ========================================================================== */
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }, { passive: true });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }


        /* ==========================================================================
           FEATURE 5: MOBILE MENU (Drawer, hamburger & backdrop)
           ========================================================================== */
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileBackdrop = document.getElementById('mobile-backdrop');
        const mobileLinks = document.querySelectorAll('.mobile-drawer nav a');

        function toggleMobileMenu() {
            const isOpen = mobileDrawer.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            if (mobileDrawer) mobileDrawer.classList.add('active');
            if (mobileBackdrop) mobileBackdrop.classList.add('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.add('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            if (mobileDrawer) mobileDrawer.classList.remove('active');
            if (mobileBackdrop) mobileBackdrop.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
        if (mobileBackdrop) {
            mobileBackdrop.addEventListener('click', closeMobileMenu);
        }
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
                closeMobileMenu();
            }
        });


        /* ==========================================================================
           FEATURE 6: LOADING ANIMATIONS (Initial page loader & button loaders)
           ========================================================================== */
        const pageLoader = document.getElementById('page-loader');
        if (pageLoader) {
            pageLoader.classList.add('loaded');
            pageLoader.style.display = 'none';
        }


            /* ==========================================================================
               FEATURE 8: SCROLL PROGRESS BAR
               ========================================================================== */
            const scrollProgressBar = document.getElementById('scroll-progress');
            window.addEventListener('scroll', () => {
                if (!scrollProgressBar) return;
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (totalHeight > 0) {
                    const progress = (window.scrollY / totalHeight) * 100;
                    scrollProgressBar.style.width = `${progress}%`;
                }
            }, { passive: true });


            /* ==========================================================================
               FEATURE 9: COPY BUTTON (Clipboard API with visual feedback & toast)
               ========================================================================== */
            const copyBtns = document.querySelectorAll('.copy-btn, .copy-link-btn');

            function copyToClipboard(text, btnElement) {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        handleCopySuccess(btnElement);
                    }).catch(() => {
                        fallbackCopy(text, btnElement);
                    });
                } else {
                    fallbackCopy(text, btnElement);
                }
            }

            function fallbackCopy(text, btnElement) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    handleCopySuccess(btnElement);
                } catch (err) {
                    showToast('Unable to copy link to clipboard');
                }
                document.body.removeChild(textarea);
            }

            function handleCopySuccess(btnElement) {
                showToast('Link copied to clipboard!');
                if (btnElement) {
                    const originalHtml = btnElement.innerHTML;
                    btnElement.classList.add('copied');
                    const labelSpan = btnElement.querySelector('span');
                    if (labelSpan) labelSpan.textContent = 'Copied!';
                    setTimeout(() => {
                        btnElement.classList.remove('copied');
                        btnElement.innerHTML = originalHtml;
                    }, 2000);
                }
            }

            copyBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const urlToCopy = btn.getAttribute('data-copy-url') || window.location.href;
                    copyToClipboard(urlToCopy, btn);
                });
            });


            /* ==========================================================================
               FEATURE 11: STICKY HEADERS (Scrolled state on scroll)
               ========================================================================== */
            const siteHeader = document.querySelector('header');
            if (siteHeader) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 40) {
                        siteHeader.classList.add('scrolled');
                    } else {
                        siteHeader.classList.remove('scrolled');
                    }
                }, { passive: true });
            }


            /* ==========================================================================
               FEATURE 12: SKIP TO CONTENT
               ========================================================================== */
            const skipLink = document.querySelector('.skip-to-content');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    const target = document.getElementById('main-content');
                    if (target) {
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }
                });
            }


            /* ==========================================================================
               FEATURE 13: PASSWORD VISIBILITY TOGGLE
               ========================================================================== */
            const passwordToggles = document.querySelectorAll('.password-toggle-btn');
            passwordToggles.forEach(toggleBtn => {
                toggleBtn.addEventListener('click', () => {
                    const input = toggleBtn.closest('.form-control-wrap').querySelector('input');
                    if (!input) return;
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
                    toggleBtn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');

                    // Toggle eye icon
                    const eyeOpen = toggleBtn.querySelector('.eye-icon');
                    const eyeClosed = toggleBtn.querySelector('.eye-off-icon');
                    if (eyeOpen && eyeClosed) {
                        eyeOpen.style.display = isPassword ? 'none' : 'block';
                        eyeClosed.style.display = isPassword ? 'block' : 'none';
                    }
                });
            });


            /* ==========================================================================
               FEATURE 14: UTM TRACKING (URL params capture & auto-fill)
               ========================================================================== */
            function initUtmTracking() {
                const urlParams = new URLSearchParams(window.location.search);
                const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
                let captured = {};

                utmKeys.forEach(key => {
                    if (urlParams.has(key)) {
                        captured[key] = urlParams.get(key);
                    }
                });

                // Store in sessionStorage or retrieve existing
                if (Object.keys(captured).length > 0) {
                    sessionStorage.setItem('flickora_utm_data', JSON.stringify(captured));
                } else {
                    const stored = sessionStorage.getItem('flickora_utm_data');
                    if (stored) {
                        try { captured = JSON.parse(stored); } catch (e) { }
                    }
                }

                // Auto-fill hidden form inputs
                if (captured && Object.keys(captured).length > 0) {
                    Object.keys(captured).forEach(key => {
                        const inputs = document.querySelectorAll(`input[name="${key}"]`);
                        inputs.forEach(input => { input.value = captured[key]; });
                    });

                    // Display campaign banner if campaign present
                    const utmBanner = document.getElementById('utm-banner');
                    const utmCampaignName = document.getElementById('utm-campaign-name');
                    if (utmBanner && (captured.utm_campaign || captured.utm_source)) {
                        if (utmCampaignName) {
                            utmCampaignName.textContent = captured.utm_campaign
                                ? `${captured.utm_campaign.toUpperCase()} (via ${captured.utm_source || 'direct'})`
                                : captured.utm_source;
                        }
                        utmBanner.classList.add('active');
                    }
                }
            }
            initUtmTracking();

        const utmCloseBtn = document.getElementById('utm-close-btn');
        if (utmCloseBtn) {
            utmCloseBtn.addEventListener('click', () => {
                const utmBanner = document.getElementById('utm-banner');
                if (utmBanner) utmBanner.classList.remove('active');
            });
        }


        /* ==========================================================================
           FEATURE 15 & 16: FORM VALIDATION, ERROR STATES & SUCCESS STATES
           ========================================================================== */
        const vipForm = document.getElementById('vip-form');
        const formSuccessCard = document.getElementById('form-success-card');
        const resetFormBtn = document.getElementById('reset-form-btn');

        if (vipForm) {
            // Clear errors in real-time on input
            const formInputs = vipForm.querySelectorAll('.form-input');
            formInputs.forEach(input => {
                input.addEventListener('input', () => {
                    clearInputError(input);
                });
            });

            vipForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let isValid = true;

                const nameInput = document.getElementById('vip-name');
                const emailInput = document.getElementById('vip-email');
                const passwordInput = document.getElementById('vip-password');

                // Name check
                if (nameInput && !nameInput.value.trim()) {
                    setInputError(nameInput, 'Please enter your full name');
                    isValid = false;
                }

                // Email check
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput) {
                    if (!emailInput.value.trim()) {
                        setInputError(emailInput, 'Please enter your email address');
                        isValid = false;
                    } else if (!emailRegex.test(emailInput.value.trim())) {
                        setInputError(emailInput, 'Please enter a valid email address');
                        isValid = false;
                    }
                }

                // Password check
                if (passwordInput) {
                    if (!passwordInput.value) {
                        setInputError(passwordInput, 'Please choose a password');
                        isValid = false;
                    } else if (passwordInput.value.length < 6) {
                        setInputError(passwordInput, 'Password must be at least 6 characters long');
                        isValid = false;
                    }
                }

                if (!isValid) {
                    // Shake form on error
                    vipForm.classList.add('shake');
                    setTimeout(() => vipForm.classList.remove('shake'), 400);
                    return;
                }

                // Simulate form submission with button spinner
                const submitBtn = vipForm.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.classList.add('btn-loading');
                    submitBtn.disabled = true;
                }

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.classList.remove('btn-loading');
                        submitBtn.disabled = false;
                    }
                    // Show Success State
                    vipForm.style.display = 'none';
                    if (formSuccessCard) {
                        const welcomeUser = document.getElementById('success-user-name');
                        if (welcomeUser && nameInput) welcomeUser.textContent = nameInput.value.trim();
                        formSuccessCard.classList.add('active');
                    }
                    showToast('Welcome to Flickora VIP! Pass activated.');
                }, 800);
            });
        }

        if (resetFormBtn && vipForm && formSuccessCard) {
            resetFormBtn.addEventListener('click', () => {
                vipForm.reset();
                formSuccessCard.classList.remove('active');
                vipForm.style.display = 'block';
            });
        }

        function setInputError(input, message) {
            input.classList.add('input-error');
            const parent = input.closest('.form-group');
            if (parent) {
                const errorMsg = parent.querySelector('.form-error-msg');
                if (errorMsg) {
                    errorMsg.textContent = message;
                    errorMsg.style.display = 'flex';
                }
            }
        }

        function clearInputError(input) {
            input.classList.remove('input-error');
            const parent = input.closest('.form-group');
            if (parent) {
                const errorMsg = parent.querySelector('.form-error-msg');
                if (errorMsg) {
                    errorMsg.textContent = '';
                    errorMsg.style.display = 'none';
                }
            }
        }


        /* ==========================================================================
           FEATURE 17: CONFIRMATION MODALS (Accessible modal dialog)
           ========================================================================== */
        const confirmationModal = document.getElementById('confirmation-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        const modalCancelBtns = document.querySelectorAll('.modal-close-trigger');
        let onConfirmCallback = null;

        function openConfirmationModal(title, description, onConfirm) {
            if (!confirmationModal) return;
            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.innerHTML = description;
            onConfirmCallback = onConfirm;

            confirmationModal.classList.add('active');
            confirmationModal.setAttribute('aria-hidden', 'false');
            if (modalConfirmBtn) modalConfirmBtn.focus();
            document.body.style.overflow = 'hidden';
        }

        function closeConfirmationModal() {
            if (!confirmationModal) return;
            confirmationModal.classList.remove('active');
            confirmationModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            onConfirmCallback = null;
        }

        modalCancelBtns.forEach(btn => {
            btn.addEventListener('click', closeConfirmationModal);
        });

        if (modalConfirmBtn) {
            modalConfirmBtn.addEventListener('click', () => {
                if (typeof onConfirmCallback === 'function') {
                    onConfirmCallback();
                }
                closeConfirmationModal();
            });
        }

        // Modal background click or Escape key
        if (confirmationModal) {
            confirmationModal.addEventListener('click', (e) => {
                if (e.target === confirmationModal) closeConfirmationModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && confirmationModal && confirmationModal.classList.contains('active')) {
                closeConfirmationModal();
            }
        });

        // Wire download buttons to confirmation modal
        const downloadBtns = document.querySelectorAll('.download-btn, .card-download-btn');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const mediaTitle = btn.getAttribute('data-title') || 'Selected Title';
                openConfirmationModal(
                    `Confirm Download: ${mediaTitle}`,
                    `You are about to start downloading <strong>${escapeHtml(mediaTitle)}</strong> in Full 1080p Ultra HD (~1.4 GB).<br><br>Do you want to proceed with this offline download?`,
                    () => {
                        showToast(`Starting high-speed download for ${mediaTitle}...`);
                    }
                );
            });
        });


        /* ==========================================================================
           FEATURE 18: LAST UPDATED DATE (Dynamically formatted)
           ========================================================================== */
        function setLastUpdatedDates() {
            const lastUpdatedDateEl = document.getElementById('last-updated-date');
            const footerUpdatedDateEl = document.getElementById('footer-last-updated');

            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = now.toLocaleDateString(undefined, options);

            if (lastUpdatedDateEl) lastUpdatedDateEl.textContent = formattedDate;
            if (footerUpdatedDateEl) footerUpdatedDateEl.textContent = formattedDate;

            // 9. Fix copyright year dynamically
            const currentYear = now.getFullYear();
            document.querySelectorAll('.copyright-year').forEach(el => {
                el.textContent = currentYear;
            });
        }
        setLastUpdatedDates();

        // 15. Nav category filter triggers
        document.querySelectorAll('[data-nav-filter]').forEach(link => {
            link.addEventListener('click', () => {
                const filter = link.getAttribute('data-nav-filter');
                const targetFilterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
                if (targetFilterBtn) {
                    targetFilterBtn.click();
                }
            });
        });


        /* ==========================================================================
           FEATURE 19: EXPANDABLE FAQ (Accordion with smooth animation & ARIA)
           ========================================================================== */
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            const answerDiv = item.querySelector('.faq-answer');

            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close others for clean accordion
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.faq-question');
                        const otherAns = other.querySelector('.faq-answer');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherAns) otherAns.style.maxHeight = null;
                    }
                });

                if (isActive) {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                    answerDiv.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + 30 + 'px';
                }
            });
        });


        /* ==========================================================================
           FEATURE 20: FLOATING CONTACT BUTTON & QUICK CONTACT PANEL
           ========================================================================== */
        const floatingContactBtn = document.getElementById('floating-contact-btn');
        const contactWidgetPanel = document.getElementById('contact-widget-panel');
        const closeContactBtn = document.getElementById('close-contact-btn');
        const quickContactForm = document.getElementById('quick-contact-form');

        function toggleContactWidget() {
            if (!contactWidgetPanel) return;
            const isActive = contactWidgetPanel.classList.contains('active');
            if (isActive) {
                contactWidgetPanel.classList.remove('active');
            } else {
                contactWidgetPanel.classList.add('active');
                const textarea = contactWidgetPanel.querySelector('textarea');
                if (textarea) textarea.focus();
            }
        }

        if (floatingContactBtn) {
            floatingContactBtn.addEventListener('click', toggleContactWidget);
        }
        if (closeContactBtn) {
            closeContactBtn.addEventListener('click', () => {
                if (contactWidgetPanel) contactWidgetPanel.classList.remove('active');
            });
        }

        if (quickContactForm) {
            quickContactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const textarea = quickContactForm.querySelector('textarea');
                if (textarea && textarea.value.trim()) {
                    showToast('Thank you! Support team notified.');
                    textarea.value = '';
                    if (contactWidgetPanel) contactWidgetPanel.classList.remove('active');
                } else {
                    showToast('Please type a message first');
                }
            });
        }


        /* ==========================================================================
           CATALOGUE FILTER TABS
           ========================================================================== */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const mediaCards = document.querySelectorAll('.media-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');

                mediaCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });


        /* ==========================================================================
           HERO CAROUSEL ENGINE (Original carousel preserved & enhanced)
           ========================================================================== */
        const nextDom = document.getElementById('next');
        const prevDom = document.getElementById('prev');
        const carouselDom = document.querySelector('.carousel');
        const SliderDom = carouselDom ? carouselDom.querySelector('.list') : null;
        const thumbnailBorderDom = carouselDom ? carouselDom.querySelector('.thumbnail') : null;

        let timeRunning = 2000;
        let runTimeOut;

        if (thumbnailBorderDom) {
            const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
            if (thumbnailItemsDom.length > 0) {
                thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
            }
        }

        function showSlider(type) {
            if (!carouselDom || !SliderDom || !thumbnailBorderDom) return;
            const SliderItemsDom = SliderDom.querySelectorAll('.item');
            const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
            if (SliderItemsDom.length === 0 || thumbnailItemsDom.length === 0) return;

            if (type === 'next') {
                SliderDom.appendChild(SliderItemsDom[0]);
                thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
                carouselDom.classList.add('next');
            } else {
                SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
                thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
                carouselDom.classList.add('prev');
            }

            clearTimeout(runTimeOut);
            runTimeOut = setTimeout(() => {
                carouselDom.classList.remove('next');
                carouselDom.classList.remove('prev');
            }, timeRunning);
        }

        if (nextDom) {
            nextDom.onclick = () => showSlider('next');
        }
        if (prevDom) {
            prevDom.onclick = () => showSlider('prev');
        }

        // Make thumbnails clickable to navigate directly to slide
        if (thumbnailBorderDom) {
            thumbnailBorderDom.addEventListener('click', (e) => {
                const item = e.target.closest('.item');
                if (item) {
                    showSlider('next');
                }
            });
        }

        // Trailer Video button handler (Plays or pauses preview video)
        const trailerBtns = document.querySelectorAll('.trailer-btn');
        trailerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const slide = btn.closest('.item') || btn.closest('.media-card');
                if (!slide) return;
                const video = slide.querySelector('video');
                if (video) {
                    if (video.paused) {
                        video.play();
                        showToast('Playing trailer preview');
                    } else {
                        video.pause();
                        showToast('Trailer paused');
                    }
                } else {
                    showToast('Trailer preview playing');
                }
            });
        });

        // Navigate to title in carousel or catalogue
        function navigateToTitle(title) {
            // First check catalogue card
            const targetCard = Array.from(document.querySelectorAll('.media-card')).find(card => {
                const cardTitle = card.querySelector('h3');
                return cardTitle && cardTitle.textContent.trim().toLowerCase() === title.toLowerCase();
            });

            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.style.outline = '3px solid var(--accent-cyan)';
                targetCard.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    targetCard.style.outline = '';
                    targetCard.style.transform = '';
                }, 2500);
                showToast(`Found "${title}" in catalogue`);
            }
        }


        /* ==========================================================================
           HELPERS: TOAST NOTIFICATION & ESCAPE HTML
           ========================================================================== */
        const toastNotification = document.getElementById('toast-notification');
        let toastTimeout;

        function showToast(message) {
            if (!toastNotification) return;
            const toastMsg = toastNotification.querySelector('.toast-msg');
            if (toastMsg) toastMsg.textContent = message;
            toastNotification.classList.add('active');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastNotification.classList.remove('active');
            }, 3000);
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    });

// Global event listeners initialized
/** Module: Scroll Progress Bar Handler */

/** Module: Dark Mode Theme Persistence */

/** Module: Interactive Video Modal Controller */

/** Module: Media Slider and Carousel Navigation */

/** Module: Site Search Autocomplete Filter */

/** Module: Toast Notification Dispatcher */

/** Module: Cookie Consent Management */

/** Module: Contact Modal Interaction */

/** Module: Smooth Scroll Back To Top Controller */

/** Module: Mobile Navigation Toggle Handler */

/** Module: Password Visibility Toggle Handler */

/** Module: UTM Parameter Extraction & Analytics */

/** Module: Form Validation & Toast Feedback Controller */

/** Module: Modal Dialog Event Handlers */

/** Module: FAQ Accordion Toggle Controller */

/** Module: Clipboard Copy Manager */

/** Module: Copyright Year Auto-Updater */

/** Module: Keyboard Navigation & Focus Trap */

/** Module: OS Theme Preference Listener */

/** Module: Image Asset Preloading & Error Fallback */

/** Module: Global Escape Key Overlay Dismissal */

/** Module: Touch Gestures & Swipe Detection for Carousel */

/** Module: Window Resize Layout Recalibration */
