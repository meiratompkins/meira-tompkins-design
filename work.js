// Portfolio Filtering JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFiltering();
    initPortfolioAnimations();
});

// Portfolio filtering functionality
function initPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(portfolioItems, filter);
        });
    });
}

function filterPortfolioItems(items, filter) {
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category');
        
        // Add filtering class for transition
        item.classList.add('filtering');
        
        setTimeout(() => {
            if (filter === 'all' || categories.includes(filter)) {
                // Show item
                item.classList.remove('filtered-out', 'hidden');
                item.style.display = 'block';
                
                // Stagger animation
                setTimeout(() => {
                    item.classList.remove('filtering');
                }, index * 50);
            } else {
                // Hide item
                item.classList.add('filtered-out');
                
                setTimeout(() => {
                    item.style.display = 'none';
                    item.classList.remove('filtering');
                }, 300);
            }
        }, 50);
    });
}

// Portfolio animations
function initPortfolioAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        observer.observe(item);
    });

    // Observe approach items
    const approachItems = document.querySelectorAll('.approach-item');
    approachItems.forEach(item => {
        observer.observe(item);
    });
}

// Portfolio item hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'Opening...';
        
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });
});

// Keyboard accessibility for filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Add ARIA attributes for accessibility
function enhanceAccessibility() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', button.classList.contains('active'));
    });
    
    portfolioItems.forEach(item => {
        item.setAttribute('role', 'article');
        item.setAttribute('tabindex', '0');
    });
}

// Initialize accessibility enhancements
enhanceAccessibility();

// Update ARIA attributes when filters change
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.setAttribute('aria-pressed', button.classList.contains('active'));
        });
    }
});

// Portfolio item keyboard navigation
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const link = this.querySelector('.project-link');
            if (link) {
                link.click();
            }
        }
    });
});

// Search functionality (optional enhancement)
function addSearchFunctionality() {
    const searchInput = document.getElementById('portfolio-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const title = item.querySelector('.project-title').textContent.toLowerCase();
            const description = item.querySelector('.project-description').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const isMatch = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.includes(searchTerm);
            
            if (isMatch || searchTerm === '') {
                item.style.display = 'block';
                item.classList.remove('filtered-out');
            } else {
                item.style.display = 'none';
                item.classList.add('filtered-out');
            }
        });
    });
}

// Performance optimization: Throttle scroll events
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

// Optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-based animations or effects here
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.work-hero');
    
    if (hero) {
        const parallaxSpeed = scrolled * 0.5;
        hero.style.transform = `translateY(${parallaxSpeed}px)`;
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add resize handler for responsive adjustments
window.addEventListener('resize', throttle(function() {
    // Handle responsive adjustments
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid && window.innerWidth < 768) {
        // Mobile-specific adjustments
        portfolioGrid.style.gap = 'var(--space-lg)';
    } else {
        portfolioGrid.style.gap = 'var(--space-3xl)';
    }
}, 250));

// Initialize search if element exists
addSearchFunctionality();

// Add error handling for image loading
document.querySelectorAll('.portfolio-item img').forEach(img => {
    img.addEventListener('error', function() {
        this.parentElement.classList.add('image-error');
        this.style.display = 'none';
    });
    
    img.addEventListener('load', function() {
        this.parentElement.classList.add('image-loaded');
    });
});

// Analytics tracking for portfolio interactions (optional)
function trackPortfolioInteraction(action, projectName) {
    // Add your analytics tracking code here
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'Portfolio',
            event_label: projectName
        });
    }
}

// Track filter usage
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        trackPortfolioInteraction('filter_used', filter);
    });
});

// Track project views
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function() {
        const projectName = this.closest('.portfolio-item').querySelector('.project-title').textContent;
        trackPortfolioInteraction('project_viewed', projectName);
    });
});

// Add focus management for better accessibility
function manageFocus() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let currentFocusIndex = -1;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const visibleItems = Array.from(portfolioItems).filter(item => 
                item.style.display !== 'none' && !item.classList.contains('filtered-out')
            );
            
            if (visibleItems.length === 0) return;
            
            if (e.key === 'ArrowDown') {
                currentFocusIndex = (currentFocusIndex + 1) % visibleItems.length;
            } else {
                currentFocusIndex = currentFocusIndex <= 0 ? visibleItems.length - 1 : currentFocusIndex - 1;
            }
            
            visibleItems[currentFocusIndex].focus();
        }
    });
}

// Initialize focus management
manageFocus();

// Add print functionality
function addPrintStyles() {
    const printButton = document.getElementById('print-portfolio');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
}

addPrintStyles();

// Progressive enhancement for advanced features
if ('IntersectionObserver' in window) {
    // Enhanced scroll animations are available
    console.log('Enhanced animations enabled');
} else {
    // Fallback for older browsers
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.classList.add('fade-in-up');
    });
}

// Service worker registration for offline functionality (optional)
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
