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
    const fixoraKB = [
        {
            keywords: ['book', 'booking', 'how to book', 'schedule', 'appointment', 'reserve'],
            reply: `📅 <strong>Booking is super easy!</strong><br><br>
1. Go to our <a href="booking.html" style="color:#6366f1;font-weight:600;">Book Now</a> page<br>
2. Fill in your name, service, location & date<br>
3. Hit "Confirm Booking" — done! ✅<br><br>
You'll get a confirmation invoice instantly. Need help choosing a service?`
        },
        {
            keywords: ['service', 'services', 'offer', 'what do you do', 'available'],
            reply: `🔧 <strong>Fixora offers a wide range of services:</strong><br><br>
🏠 <strong>Home Services:</strong> Cleaning, Painting, Plumbing, Electrical<br>
💻 <strong>IT & Digital:</strong> Web Dev, UI/UX Design, React Apps<br>
🔌 <strong>Installation:</strong> CCTV, WiFi Setup, AC Fitting<br>
📚 <strong>Tutoring:</strong> Math, Science, & more<br><br>
Browse all on our <a href="services.html" style="color:#6366f1;font-weight:600;">Services page</a>!`
        },
        {
            keywords: ['price', 'cost', 'how much', 'fee', 'charge', 'rate', 'pricing'],
            reply: `💰 <strong>Fixora Pricing:</strong><br><br>
Pricing varies by service type and professional. Here's a rough guide:<br>
• Home Cleaning: <strong>Rs 2,500 – 5,000</strong><br>
• Plumbing: <strong>Rs 1,000 – 3,000</strong><br>
• Web Development: <strong>Rs 15,000+</strong><br>
• Electrical: <strong>Rs 500 – 2,500</strong><br><br>
💡 All prices are shown <strong>before you confirm</strong> — no hidden fees!`
        },
        {
            keywords: ['verified', 'safe', 'trust', 'background', 'check', 'legitimate', 'professional'],
            reply: `✅ <strong>Yes! All Fixora professionals are:</strong><br><br>
🔍 Background-checked & ID-verified<br>
⭐ Rated by real customers<br>
🛡️ Covered by our Satisfaction Guarantee<br>
📋 Skill-tested in their category<br><br>
If you're ever unhappy, report within 24 hrs for a <strong>free re-visit or refund</strong>!`
        },
        {
            keywords: ['support', 'contact', 'help', 'phone', 'email', 'customer service', 'complaint'],
            reply: `📞 <strong>We're here for you 24/7!</strong><br><br>
📧 Email: <strong>support@fixora.com</strong><br>
📱 Phone: <strong>+92 304 4762204</strong><br>
💬 Live Chat: You're already using it!<br><br>
Or visit our <a href="contact.html" style="color:#6366f1;font-weight:600;">Contact Page</a> to send a message directly.`
        },
        {
            keywords: ['office', 'offices', 'location', 'address', 'where', 'headquarter', 'hq', 'nyc', 'uk', 'pakistan', 'australia'],
            reply: `🌍 <strong>Fixora Global Offices:</strong><br><br>
🇺🇸 <strong>New York (HQ):</strong> One World Trade Center, Suite 4500<br>
🇵🇰 <strong>Lahore, Pakistan:</strong> Plot 123, Block A, Commercial Area<br>
🇬🇧 <strong>London, UK:</strong> 100 King's Cross Road<br>
🇦🇺 <strong>Sydney, Australia:</strong> Level 12, 100 George Street<br><br>
See interactive maps on our <a href="contact.html" style="color:#6366f1;font-weight:600;">Contact Page</a>!`
        },
        {
            keywords: ['cancel', 'cancellation', 'reschedule', 'refund'],
            reply: `🔄 <strong>Cancellation Policy:</strong><br><br>
• Cancel <strong>4+ hours before</strong> your booking: <span style="color:#10b981">✅ Free</span><br>
• Cancel less than 4 hours before: <span style="color:#f59e0b">⚠️ Rs 500 fee</span><br>
• Unhappy with service? Report within 24hrs for a <strong>free re-visit!</strong><br><br>
Need to reschedule? Just call us at <strong>+92 304 4762204</strong>.`
        },
        {
            keywords: ['invoice', 'receipt', 'bill', 'payment proof'],
            reply: `🧾 <strong>Getting your invoice:</strong><br><br>
After confirming a booking, you'll be <strong>automatically redirected</strong> to a detailed invoice page with:<br>
• Service breakdown<br>
• Total cost + tax<br>
• Terms & conditions<br><br>
You can also <strong>print or download</strong> the invoice as a PDF!`
        },
        {
            keywords: ['app', 'download', 'mobile', 'play store', 'apple', 'ios', 'android'],
            reply: `📱 <strong>Fixora Mobile App:</strong><br><br>
Our app is <strong>coming soon!</strong> 🚀<br><br>
You can find the download buttons in the footer of every page. Be the first to know — subscribe to our newsletter for launch updates!`
        },
        {
            keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'salaam', 'salam', 'assalam'],
            reply: `👋 <strong>Hello there!</strong> Welcome to Fixora!<br><br>
I'm your AI assistant, ready to help you with bookings, services, pricing & more. What can I help you with today? 😊`
        },
        {
            keywords: ['thank', 'thanks', 'thankyou', 'great', 'awesome', 'perfect', 'helpful'],
            reply: `😊 You're very welcome! That's what I'm here for.<br><br>Is there anything else I can help you with? You can also visit our <a href="booking.html" style="color:#6366f1;font-weight:600;">Book Now</a> page to get started!`
        }
    ];

    function getBotReply(input) {
        const lower = input.toLowerCase().trim();
        for (const item of fixoraKB) {
            if (item.keywords.some(kw => lower.includes(kw))) {
                return item.reply;
            }
        }
        return `🤔 I'm not sure about that specific question, but here's what I can help with:<br><br>
📅 Booking a service · 🔧 Service categories · 💰 Pricing<br>
✅ Professional verification · 📞 Support · 🌍 Office locations<br><br>
Or contact us directly at <strong>support@fixora.com</strong> or <strong>+92 304 4762204</strong>!`;
    }

    const sendMessage = (inputText) => {
        const text = inputText || (chatbotInput && chatbotInput.value.trim());
        if (!text || !chatbotBody) return;
        if (chatbotInput) chatbotInput.value = '';

        // Hide quick replies after first message
        const qr = document.getElementById('quick-replies');
        if (qr) qr.style.display = 'none';

        // User message
        const userMsg = document.createElement('div');
        userMsg.classList.add('chat-message', 'user');
        userMsg.innerHTML = `<div class="chat-bubble">${text}</div>`;
        chatbotBody.appendChild(userMsg);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // Typing indicator
        const typingEl = document.createElement('div');
        typingEl.classList.add('chat-message', 'bot');
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <div class="chat-avatar"><i data-lucide="sparkles"></i></div>
            <div class="chat-bubble" style="padding: 12px 18px;">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>`;
        chatbotBody.appendChild(typingEl);
        lucide.createIcons();
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        setTimeout(() => {
            typingEl.remove();
            const botMsg = document.createElement('div');
            botMsg.classList.add('chat-message', 'bot');
            const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            botMsg.innerHTML = `
                <div class="chat-avatar"><i data-lucide="sparkles"></i></div>
                <div>
                    <div class="chat-bubble">${getBotReply(text)}</div>
                    <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 4px; margin-left: 4px;">${now}</div>
                </div>`;
            chatbotBody.appendChild(botMsg);
            lucide.createIcons();
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 1200);
    };

    window.sendQuickReply = (text) => sendMessage(text);

    if (chatbotSendBtn) chatbotSendBtn.addEventListener('click', () => sendMessage());
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

    // 11. Password Visibility Toggle
    const toggleIcons = document.querySelectorAll('.toggle-icon');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
        });
    });
});
