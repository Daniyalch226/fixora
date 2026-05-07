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
    window.simulateFormSubmit = (e, message = "Form submitted successfully!", redirectUrl = null) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="lucide-loader-2 animate-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    alert(message);
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    e.target.reset();
                }
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

    // 7. Command Menu Logic (Startup Feel)
    const cmdMenu = document.getElementById('cmd-menu');
    const cmdInput = document.getElementById('cmd-input');
    const openCmdBtn = document.getElementById('open-cmd-menu');
    
    const toggleCmdMenu = (show) => {
        if (!cmdMenu) return;
        const isOpened = show !== undefined ? show : !cmdMenu.classList.contains('active');
        if (isOpened) {
            cmdMenu.classList.add('active');
            setTimeout(() => cmdInput && cmdInput.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            cmdMenu.classList.remove('active');
            if(cmdInput) cmdInput.blur();
            document.body.style.overflow = '';
        }
    };

    if (openCmdBtn) {
        openCmdBtn.addEventListener('click', () => toggleCmdMenu(true));
    }

    if (cmdMenu) {
        cmdMenu.addEventListener('click', (e) => {
            if (e.target === cmdMenu) toggleCmdMenu(false);
        });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K to open
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggleCmdMenu(true);
        }
        // ESC to close
        if (e.key === 'Escape' && cmdMenu && cmdMenu.classList.contains('active')) {
            toggleCmdMenu(false);
        }
    });

    // 8. Chatbot Widget Logic
    const aiFabBtn = document.querySelector('.ai-fab-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbotBtn = document.getElementById('close-chatbot');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotBody = document.getElementById('chatbot-body');

    const toggleChatbot = (show) => {
        if (!chatbotWindow) return;
        const isOpened = show !== undefined ? show : !chatbotWindow.classList.contains('active');
        if (isOpened) {
            chatbotWindow.classList.add('active');
            setTimeout(() => chatbotInput && chatbotInput.focus(), 100);
        } else {
            chatbotWindow.classList.remove('active');
        }
    };

    if (aiFabBtn) {
        aiFabBtn.addEventListener('click', () => toggleChatbot());
    }

    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', () => toggleChatbot(false));
    }

    // Handle sending a message in the chatbot
    const sendMessage = () => {
        if (!chatbotInput || !chatbotInput.value.trim() || !chatbotBody) return;
        
        const userText = chatbotInput.value.trim();
        chatbotInput.value = '';
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.classList.add('chat-message');
        userMsg.style.justifyContent = 'flex-end';
        userMsg.innerHTML = `<div class="chat-bubble" style="background: var(--primary); color: white; border-bottom-right-radius: 4px; border-bottom-left-radius: 16px;">${userText}</div>`;
        chatbotBody.appendChild(userMsg);
        
        // Scroll to bottom
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
        
        // Simulate bot reply
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.classList.add('chat-message', 'bot');
            botMsg.innerHTML = `
                <div class="chat-avatar"><i data-lucide="bot"></i></div>
                <div class="chat-bubble">I can certainly help with that! Since I'm a demo bot, please use the search bar above to find specific services.</div>
            `;
            chatbotBody.appendChild(botMsg);
            lucide.createIcons();
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 1000);
    };

    if (chatbotSendBtn) chatbotSendBtn.addEventListener('click', sendMessage);
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // 8. 3D Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 20; // Decreased intensity for smoother feel
            const tiltY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 9. Particle Generation
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 6 + 2; // 2px to 8px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            
            // Random colors for particles based on theme
            const colors = ['#6366f1', '#3b82f6', '#f43f5e', '#a855f7'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const duration = Math.random() * 15 + 5; // 5s to 20s
            particle.style.animationDuration = `${duration}s`;
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        };
        
        // Initial burst
        for(let i=0; i<20; i++) {
            setTimeout(createParticle, Math.random() * 2000);
        }
        
        // Continuous generation
        setInterval(createParticle, 400);
    }

    // 10. Pause Scroller on Click (for touch/mobile)
    const scrollerTrack = document.querySelector('.scroller-track');
    if (scrollerTrack) {
        scrollerTrack.addEventListener('click', () => {
            scrollerTrack.classList.toggle('paused');
        });
    }
});
