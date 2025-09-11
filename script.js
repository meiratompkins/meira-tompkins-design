// Main JavaScript for Meira Tompkins Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initActiveNavigation();
    initTypewriter();
    initContactForm();
    initThemeToggle();
    initFloatingNavigation();
    initMobileFAB();
    initScrollTextAnimations();
    initScrollIndicator();
    initFAQ();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background when scrolled
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    function updateActiveNav() {
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveNav, 100));
    updateActiveNav(); // Initial call
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add staggered animation for work cards
                if (entry.target.classList.contains('work-card')) {
                    const cards = document.querySelectorAll('.work-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in-up');
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.work-card, .services-content, .section-header, .cta-content');
    animateElements.forEach(el => observer.observe(el));

    // Parallax effect removed to keep hero visual static
}

// Typewriter effect for hero title (disabled)
function initTypewriter() {
    // Animation disabled - text will appear immediately
    return;
}

// Contact form handling
function initContactForm() {
    const contactForms = document.querySelectorAll('form[data-contact-form]');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Update button state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                
                // Reset form
                form.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    });
}

// Theme toggle functionality (optional)
function initThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button
        themeToggle.setAttribute('aria-label', 
            newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    });
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 20px',
        backgroundColor: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        maxWidth: '400px',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Close functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => removeNotification(notification));
    
    // Auto-remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Work card interactions
function initWorkCardInteractions() {
    const workCards = document.querySelectorAll('.work-card');
    
    workCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize work card interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', initWorkCardInteractions);

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'styles.css',
        // Add any critical images or fonts here
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });
}

// Initialize everything when page loads
window.addEventListener('load', function() {
    initLazyLoading();
    preloadCriticalResources();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// Floating Navigation for About Page
function initFloatingNavigation() {
    const floatingNav = document.getElementById('floating-nav');
    const progressBar = document.getElementById('progress-bar');
    const navItems = document.querySelectorAll('.floating-nav .nav-item');
    
    // Only initialize on about page
    if (!floatingNav) return;
    
    // Get all sections
    const sections = [
        { id: 'hero', element: document.getElementById('hero') },
        { id: 'expertise', element: document.getElementById('expertise') },
        { id: 'philosophy', element: document.getElementById('philosophy') },
        { id: 'collaboration', element: document.getElementById('collaboration') },
        { id: 'beyond', element: document.getElementById('beyond') },
        { id: 'connect', element: document.getElementById('connect') }
    ].filter(section => section.element);
    
    // Show floating nav after scrolling a bit
    function updateFloatingNav() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show nav after scrolling 200px
        if (scrolled > 200) {
            floatingNav.classList.add('visible');
        } else {
            floatingNav.classList.remove('visible');
        }
        
        // Update progress bar
        const progress = (scrolled / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
        
        // Update active section
        updateActiveSection();
    }
    
    function updateActiveSection() {
        const scrollPosition = window.pageYOffset + 200;
        let activeSection = sections[0];
        
        // Find current section
        sections.forEach(section => {
            if (section.element.offsetTop <= scrollPosition) {
                activeSection = section;
            }
        });
        
        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === activeSection.id) {
                item.classList.add('active');
            }
        });
    }
    
    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll listener with throttling
    let ticking = false;
    function throttledUpdate() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateFloatingNav();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', throttledUpdate);
    
    // Initial update
    updateFloatingNav();
}

// Mobile FAB Navigation
function initMobileFAB() {
    const floatingFAB = document.getElementById('floating-fab');
    const sectionModal = document.getElementById('section-modal');
    const modalClose = document.getElementById('modal-close');
    const fabNumber = document.getElementById('fab-number');
    const modalProgressBar = document.getElementById('modal-progress-bar');
    const modalSectionItems = document.querySelectorAll('.modal-section-item');
    
    // Only initialize on about page with mobile screen
    if (!floatingFAB || !sectionModal) return;
    
    // Get all sections
    const sections = [
        { id: 'hero', element: document.getElementById('hero') },
        { id: 'expertise', element: document.getElementById('expertise') },
        { id: 'philosophy', element: document.getElementById('philosophy') },
        { id: 'collaboration', element: document.getElementById('collaboration') },
        { id: 'beyond', element: document.getElementById('beyond') },
        { id: 'connect', element: document.getElementById('connect') }
    ].filter(section => section.element);
    
    let currentSectionIndex = 0;
    
    function updateFABAndModal() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show FAB after scrolling 200px (only on mobile)
        if (window.innerWidth <= 1024) {
            if (scrolled > 200) {
                floatingFAB.classList.add('visible');
            } else {
                floatingFAB.classList.remove('visible');
            }
        }
        
        // Update progress bar
        const progress = (scrolled / (documentHeight - windowHeight)) * 100;
        modalProgressBar.style.width = Math.min(progress, 100) + '%';
        
        // Update active section
        updateActiveMobileSection();
    }
    
    function updateActiveMobileSection() {
        const scrollPosition = window.pageYOffset + 200;
        let activeSection = sections[0];
        let activeSectionIndex = 0;
        
        // Find current section
        sections.forEach((section, index) => {
            if (section.element.offsetTop <= scrollPosition) {
                activeSection = section;
                activeSectionIndex = index;
            }
        });
        
        currentSectionIndex = activeSectionIndex;
        
        // Update FAB number
        fabNumber.textContent = activeSectionIndex + 1;
        
        // Update active modal section item
        modalSectionItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === activeSection.id) {
                item.classList.add('active');
            }
        });
    }
    
    function openModal() {
        sectionModal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        sectionModal.classList.remove('visible');
        document.body.style.overflow = '';
    }
    
    // FAB click to open modal
    floatingFAB.addEventListener('click', openModal);
    
    // Close modal events
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking backdrop
    sectionModal.addEventListener('click', function(e) {
        if (e.target === sectionModal) {
            closeModal();
        }
    });
    
    // Handle modal section clicks
    modalSectionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                closeModal();
                
                // Wait for modal to close, then scroll
                setTimeout(() => {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
    
    // Handle swipe down to close modal
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    const modalContent = sectionModal.querySelector('.modal-content');
    
    modalContent.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    
    modalContent.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 0) {
            modalContent.style.transform = `translateY(${deltaY}px)`;
        }
    });
    
    modalContent.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const deltaY = currentY - startY;
        
        if (deltaY > 150) {
            closeModal();
        }
        
        modalContent.style.transform = 'translateY(0)';
        isDragging = false;
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sectionModal.classList.contains('visible')) {
            closeModal();
        }
    });
    
    // Add scroll listener with throttling
    let ticking = false;
    function throttledMobileUpdate() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateFABAndModal();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', throttledMobileUpdate);
    window.addEventListener('resize', throttledMobileUpdate);
    
    // Initial update
    updateFABAndModal();
    
    // Ensure scroll indicator is visible
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.display = 'flex';
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.visibility = 'visible';
    }
    
    // Ensure work preview elements stay visible
    const workPreview = document.getElementById('work-preview');
    if (workPreview) {
        const workCards = workPreview.querySelectorAll('.work-card.fade-in-up');
        const sectionCta = workPreview.querySelector('.section-cta .fade-in-up');
        
        // Force work cards to stay visible after animation
        workCards.forEach(card => {
            if (card.classList.contains('visible')) {
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.transform = 'translateY(0)';
            }
        });
        
        // Force section CTA to stay visible
        if (sectionCta && sectionCta.classList.contains('visible')) {
            sectionCta.style.opacity = '1';
            sectionCta.style.visibility = 'visible';
            sectionCta.style.transform = 'translateY(0)';
        }
    }
}

// Scroll Text Animations - Working system
function initScrollTextAnimations() {
    // Create intersection observer for fade-in-up animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                // Add visible class to trigger animation
                entry.target.classList.add('visible');
                
                // Stop observing this element once it's animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    const animateElements = document.querySelectorAll('.fade-in-up');
    animateElements.forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });
    
    // Ensure hero elements are immediately visible on page load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.work-hero .fade-in-up, .services-hero .fade-in-up, .contact-hero .fade-in-up');
        heroElements.forEach(el => {
            if (!el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });
        
        // Ensure contact section elements are immediately visible
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            const contactElements = contactSection.querySelectorAll('.fade-in-up');
            contactElements.forEach(el => {
                el.classList.add('visible');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
        
        // Ensure expectations section elements are immediately visible
        const expectationsSection = document.querySelector('.expectations-section');
        if (expectationsSection) {
            const expectationsElements = expectationsSection.querySelectorAll('.fade-in-up');
            expectationsElements.forEach(el => {
                el.classList.add('visible');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
        
        // Ensure FAQ section elements are immediately visible
        const faqSection = document.querySelector('.faq-section');
        if (faqSection) {
            const faqElements = faqSection.querySelectorAll('.fade-in-up');
            faqElements.forEach(el => {
                el.classList.add('visible');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
        
        // Ensure contact CTA section is immediately visible
        const contactCTA = document.querySelector('.contact-cta');
        
        if (contactCTA) {
            const contactElements = contactCTA.querySelectorAll('.fade-in-up');
            contactElements.forEach(el => {
                el.classList.add('visible');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    }, 100);
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Scroll Indicator functionality
function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Scroll to the work preview section
            const workPreview = document.getElementById('work-preview');
            if (workPreview) {
                const headerOffset = 80;
                const elementPosition = workPreview.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// FAQ Accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('[data-faq-item]');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        
        if (!header || !content) return;
        
        // Handle click events
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.faq-header');
                    const otherContent = otherItem.querySelector('.faq-content');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Handle keyboard events for accessibility
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
        
        // Handle Enter key on the entire header
        header.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                header.click();
            }
        });
    });
    
    // Optional: Auto-open first FAQ item on page load
    if (faqItems.length > 0) {
        // Uncomment the line below if you want the first FAQ to be open by default
        // faqItems[0].classList.add('active');
        // faqItems[0].querySelector('.faq-header').setAttribute('aria-expanded', 'true');
    }
}

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
