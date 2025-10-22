/**
 * Portfolio JavaScript
 * Author: Omphile Mokhuane
 * Last Updated: 2025
 * Improved & Refactored
 */

// ==================== 
// INITIALIZATION
// ==================== 
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * Initialize all app functionality
 */
function initApp() {
    updateCopyrightYear();
    initSmoothScrolling();
    initMobileNavigation();
    initScrollAnimations();
    animateStats();
    initActiveNavLinks();
    initCanvasAnimation();
}

// ==================== 
// COPYRIGHT YEAR
// ==================== 
/**
 * Updates the copyright year in the footer
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==================== 
// SMOOTH SCROLLING
// ==================== 
/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href') === '#') return;
        
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                closeMobileNav();
                
                // Calculate offset for fixed navbar
                const navbarHeight = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ==================== 
// MOBILE NAVIGATION
// ==================== 
/**
 * Initializes hamburger menu functionality
 */
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('main-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        toggleMobileNav(hamburger, navMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileNav();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    });
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileNav(hamburger, navMenu) {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    
    hamburger.setAttribute('aria-expanded', !isOpen);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

/**
 * Close mobile navigation menu
 */
function closeMobileNav() {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('main-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
}

// ==================== 
// ACTIVE NAV LINKS
// ==================== 
/**
 * Highlights active navigation link based on scroll position
 */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveNavLink(id);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Updates active state of navigation links
 */
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
            link.style.color = 'var(--color-secondary)';
        } else {
            link.style.color = '';
        }
    });
}

// ==================== 
// SCROLL ANIMATIONS
// ==================== 
/**
 * Initializes scroll-triggered animations
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.project-card, .stat-card, .tech-card, .contact-item, .polaroid'
    );
    
    if (!elements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// ==================== 
// STATS ANIMATION
// ==================== 
/**
 * Animates counting numbers in stats section
 */
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statNumbers.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * Animates a number from 0 to target value
 */
function animateValue(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ==================== 
// CANVAS ANIMATION
// ==================== 
/**
 * Initializes particle canvas animation
 */
function initCanvasAnimation() {
    const canvas = document.getElementById('lamp-anim');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    let animationId;
    
    // Resize canvas to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    
    // Initialize particles with random properties
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    // Draw and animate particles
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(163, 247, 191, ${particle.opacity})`;
            ctx.fill();
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            }
        });
        
        // Draw connections between nearby particles
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Draw lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(163, 247, 191, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Initialize and start animation
    resizeCanvas();
    animate();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cancelAnimationFrame(animationId);
            resizeCanvas();
            animate();
        }, 250);
    });
    
    // Pause animation when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// ==================== 
// UTILITY FUNCTIONS
// ==================== 
/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}