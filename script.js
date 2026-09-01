document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Live Digital Clock (HH:MM:SS)
    // ==========================================
    const liveClock = document.getElementById('liveClock');
    
    function updateClock() {
        if (!liveClock) return;
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        liveClock.textContent = `${hrs}:${mins}:${secs}`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ==========================================
    // 2. Reading Progress Bar, Roadmap Tracer & Scroll Tracking
    // ==========================================
    const progressBar = document.getElementById('progressBar');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const sections = document.querySelectorAll('section.slide');
    const pillLinks = document.querySelectorAll('.pill-nav .pill-link');
    const roadmapContainer = document.getElementById('roadmapTimeline');
    const roadmapProgress = document.getElementById('roadmapProgress');
    const roadmapItems = document.querySelectorAll('.roadmap-item');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Main page progress bar width
        if (progressBar && docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollTop > 450) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Active pill navigation on scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollTop >= (sectionTop - 280)) {
                currentSection = section.getAttribute('id');
            }
        });

        pillLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else if (currentSection && currentSection.startsWith('project-') && href === '#projects-overview') {
                link.classList.add('active');
            }
        });

        // Interactive Roadmap Center Line Progress & Node Active State
        if (roadmapContainer && roadmapProgress) {
            const containerRect = roadmapContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate how far the timeline center is through the viewport
            const triggerPoint = windowHeight * 0.65;
            const startOffset = containerRect.top - triggerPoint;
            const totalHeight = containerRect.height;

            if (startOffset < 0) {
                let progressPercent = Math.min(Math.max((-startOffset / totalHeight) * 100, 0), 100);
                roadmapProgress.style.height = `${progressPercent}%`;
            } else {
                roadmapProgress.style.height = `0%`;
            }

            // Activate nodes based on their position relative to viewport trigger line
            roadmapItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top < triggerPoint) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 3. Scroll Reveal Animations (Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ==========================================
    // 4. Interactive Click-to-Copy Email & Phone Toast
    // ==========================================
    const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
    const copyPhoneButtons = document.querySelectorAll('.copy-phone-btn');
    const toast = document.getElementById('toastNotification');
    const toastText = toast ? toast.querySelector('span') : null;
    let toastTimeout;

    function showToast(message) {
        if (!toast) return;
        if (toastText) toastText.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'vigyat27@gmail.com';
            
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard!');
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    });

    copyPhoneButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = '+91 8770946617';
            
            navigator.clipboard.writeText(phone).then(() => {
                showToast('Phone number copied to clipboard!');
            }).catch(() => {
                window.location.href = 'tel:+918770946617';
            });
        });
    });

    // ==========================================
    // 5. Subtle 3D Card Hover Tilt (Desktop)
    // ==========================================
    if (window.innerWidth > 992) {
        const tiltCards = document.querySelectorAll('.project-card, .about-highlight-card, .radar-card, .skills-compact-card, .roadmap-card, .hero-stat-chip, .visual-service-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});
