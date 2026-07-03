/**
 * Portfolio JavaScript
 * Handles dark mode toggle, mobile menu, navigation, and smooth scrolling
 * Vanilla JavaScript - No framework dependencies
 */

// ========================================
// DARK MODE THEME MANAGEMENT
// ========================================

/**
 * Initialize theme based on user preference or localStorage
 * Respects system preference if no saved theme exists
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

/**
 * Apply theme to document
 * @param {string} theme - 'dark' or 'light'
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// ========================================
// MOBILE MENU MANAGEMENT
// ========================================

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('mobileMenuToggle');

    navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', 
        navMenu.classList.contains('active') ? 'true' : 'false'
    );
}

/**
 * Close mobile menu when link is clicked
 */
function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('mobileMenuToggle');

    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
}

// ========================================
// EVENT LISTENERS - INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme on page load
    initializeTheme();

    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const navbar = document.querySelector('.navbar');
        const navMenu = document.getElementById('navMenu');

        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Setup smooth scroll for hash links
    setupSmoothScroll();

    // Setup intersection observer for animations
    setupIntersectionObserver();

    // Setup scroll spy for active nav links
    setupScrollSpy();

    // Handle system theme preference changes
    setupSystemThemeListener();
});

// ========================================
// SMOOTH SCROLL BEHAVIOR
// ========================================

/**
 * Setup smooth scroll for anchor links
 * Accounts for sticky navbar height
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just '#'
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            e.preventDefault();

            // Calculate offset accounting for navbar height (64px)
            const navbarHeight = 64;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// SCROLL SPY - ACTIVE NAVIGATION LINKS
// ========================================

/**
 * Setup scroll spy to highlight current section in navigation
 */
function setupScrollSpy() {
    window.addEventListener('scroll', updateActiveNavLink, false);
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // Account for navbar height
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// ========================================
// INTERSECTION OBSERVER - FADE IN ANIMATIONS
// ========================================

/**
 * Setup intersection observer for card fade-in animations
 */
function setupIntersectionObserver() {
    // Only setup if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all cards immediately
        document.querySelectorAll('.project-card, .skill-card, .contact-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Set initial state and observe cards
    const cards = document.querySelectorAll('.project-card, .skill-card, .contact-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ========================================
// SYSTEM THEME PREFERENCE LISTENER
// ========================================

/**
 * Listen for system theme preference changes
 * Updates theme if user hasn't explicitly set a preference
 */
function setupSystemThemeListener() {
    if (!window.matchMedia) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Use addEventListener if available (modern browsers)
    if (darkModeQuery.addEventListener) {
        darkModeQuery.addEventListener('change', (e) => {
            // Only update if no theme was explicitly saved
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ========================================
// KEYBOARD ACCESSIBILITY
// ========================================

/**
 * Handle keyboard navigation for mobile menu
 */
document.addEventListener('keydown', (e) => {
    // Close menu on Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
});

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});