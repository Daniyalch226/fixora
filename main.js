/* 
    Fixora - Interactive Scripts
*/

document.addEventListener('DOMContentLoaded', () => {
    // 0. Page Load Animation
    document.body.classList.add('loaded');

    // 1. Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle (Sidebar + Backdrop)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const backdrop = document.querySelector('.menu-backdrop');
    const mobileIcon = mobileBtn ? mobileBtn.querySelector('i') : null;
    
    const toggleMenu = (show) => {
        const isOpened = show !== undefined ? show : !navLinks.classList.contains('active');
        navLinks.classList.toggle('active', isOpened);
        if (backdrop) backdrop.classList.toggle('active', isOpened);
        document.body.style.overflow = isOpened ? 'hidden' : '';
        
        // Toggle Icon
        if (mobileIcon) {
            mobileIcon.setAttribute('data-lucide', isOpened ? 'x' : 'menu');
            lucide.createIcons();
        }
    };

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => toggleMenu());
        if (backdrop) backdrop.addEventListener('click', () => toggleMenu(false));

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    // 2.1 Live Activity Text Rotation
    const liveTextEl = document.getElementById('live-text');
    if (liveTextEl) {
        const activities = [
            "Expert available in Lahore right now",
            "Someone just booked an AC Repair",
            "50+ Cleaners active in your area",
            "Top-rated Electrician arrived in Gulberg",
            "IT Specialist solving a query live"
        ];
        let index = 0;
        setInterval(() => {
            index = (index + 1) % activities.length;
            liveTextEl.style.opacity = '0';
            setTimeout(() => {
                liveTextEl.innerText = activities[index];
                liveTextEl.style.opacity = '1';
            }, 300);
        }, 4000);
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Counter Animation for Stats
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const prefix = stat.getAttribute('data-prefix') || '';
                    const suffix = stat.getAttribute('data-suffix') || '';
                    
                    const count = () => {
                        const currentText = stat.innerText.replace(/[^0-9]/g, '');
                        const current = parseInt(currentText) || 0;
                        const increment = target / 50;
                        
                        if (current < target) {
                            stat.innerText = prefix + Math.ceil(current + increment) + suffix;
                            setTimeout(count, 30);
                        } else {
                            stat.innerText = prefix + target + suffix;
                        }
                    };
                    count();
                });
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // 5. Success Alerts (for simulated forms)
    window.simulateFormSubmit = (e, message = "Form submitted successfully!") => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="lucide-loader-2 animate-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                alert(message);
                btn.innerHTML = originalText;
                btn.disabled = false;
                e.target.reset();
            }, 1500);
        }
    };

    // 6. Hero Image Crossfade Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000); // Crossfade every 5 seconds
    }
});
