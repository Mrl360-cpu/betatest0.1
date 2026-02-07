document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const updateNavbar = () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // Active Link Highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Apply animation classes to elements
    const animateElements = document.querySelectorAll('.reveal-item, .major-card, .about-card, .facility-item, .glass, .glass-hover');
    animateElements.forEach(el => {
        if (!el.classList.contains('reveal-item')) el.classList.add('reveal-item');
        observer.observe(el);
    });

    // MindSmeck Bot Assistant with Gemini AI
    const initBot = () => {
        if (currentPath === '' || currentPath === '/') {
            // Default to index if at root
        }

        const botName = "MindSmeck";
        const GEMINI_API_KEY = "AIzaSyAFVRw3xWM5X2prm3l7TIDjVNR-lt-da44";

        const botHTML = `
            <div class="tour-overlay" id="tourOverlay"></div>
            <div class="bot-container">
                <div class="bot-message-bubble" id="botBubble">
                    <div class="bot-header">
                        <span class="bot-name">${botName}</span>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <i class="fas fa-robot"></i>
                            <button id="closeBot" style="background:none; border:none; color:inherit; cursor:pointer; font-size:1.1rem;"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div id="tourContent">
                        <div class="bot-content" id="botContent">
                            Selamat datang! Saya ${botName}. Ingin tur singkat mengenal website SMKN 9 Manado?
                        </div>
                        <div class="bot-actions" id="botActions">
                            <button class="btn btn-primary btn-sm" id="btnNext">Mulai Tur</button>
                            <button class="btn btn-skip btn-sm" id="btnSkip">Chat AI</button>
                        </div>
                    </div>
                    <div id="chatInterface" style="display:none;">
                        <div class="chat-history" id="chatHistory">
                            <div class="bot-msg">Halo! Saya ${botName} AI. Tanyakan apa saja tentang sekolah kami!</div>
                        </div>
                        <div class="chat-input-container">
                            <input type="text" class="chat-input" id="chatInput" placeholder="Ketik pesan...">
                            <button class="btn-send" id="btnSend"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
                <div class="bot-avatar" id="botAvatar">
                    <i class="fas fa-comment-dots"></i>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', botHTML);

        const bubble = document.getElementById('botBubble');
        const content = document.getElementById('botContent');
        const overlay = document.getElementById('tourOverlay');
        const btnNext = document.getElementById('btnNext');
        const btnSkip = document.getElementById('btnSkip');
        const avatar = document.getElementById('botAvatar');
        const closeBot = document.getElementById('closeBot');
        const tourContent = document.getElementById('tourContent');
        const chatInterface = document.getElementById('chatInterface');
        const chatHistory = document.getElementById('chatHistory');
        const chatInput = document.getElementById('chatInput');
        const btnSend = document.getElementById('btnSend');

        let step = 0;
        const tourSteps = [
            { element: '.navbar', message: 'Ini menu navigasi fitur sekolah.' },
            { element: '.hero-section', message: 'Halaman utama visi & misi kami.' },
            { element: '.principal-section', message: 'Sambutan dari Kepala Sekolah.' },
            { element: '.majors-grid', message: 'Daftar jurusan unggulan kami.' }
        ];

        const showStep = () => {
            if (step >= tourSteps.length) {
                content.innerHTML = 'Tur selesai! Silakan chat saya jika ada pertanyaan.';
                btnNext.style.display = 'none';
                btnSkip.innerHTML = 'Buka Chat AI';
                document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
                overlay.classList.remove('active');
                return;
            }
            const currentStep = tourSteps[step];
            if (!currentStep) return;
            const targetEl = document.querySelector(currentStep.element);
            document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetEl.classList.add('tour-highlight');
                content.innerHTML = currentStep.message;
                step++;
            } else { step++; showStep(); }
        };

        const switchToChat = () => {
            tourContent.style.display = 'none';
            chatInterface.style.display = 'block';
            bubble.classList.add('active');
            chatHistory.scrollTop = chatHistory.scrollHeight;
        };

        const callGeminiAI = async (userText) => {
            try {
                // Konfigurasi API Gemini - Menggunakan v1beta karena v1 sering bermasalah dengan model terbaru
                const MODEL = "gemini-1.5-flash";
                const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

                console.log(`MindSmeck AI: Menghubungi ${MODEL} via v1beta...`);

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Anda adalah MindSmeck, asisten virtual resmi SMK Negeri 9 Manado. Karakter: Ramah, profesional, dan bangga akan sekolah. Gunakan bahasa Indonesia yang baik. Info: Jl. Siswa No. 59 Manado, Plt. Kepsek Alther Rarung S.Pd. Jurusan: TKJ, Farmasi, Keperawatan, OTKP, Akuntansi. Pertanyaan: ${userText}`
                            }]
                        }]
                    })
                });

                const data = await response.json();

                if (data.error) {
                    console.error("Gemini Error Object:", data.error);
                    const msg = data.error.message;
                    if (msg.includes("API key not valid")) {
                        return "Konfigurasi API Key salah atau belum aktif. Pastikan Key dari Google AI Studio sudah benar.";
                    }
                    if (msg.includes("location")) {
                        return "Maaf, akses AI ini dibatasi di wilayah Anda. Gunakan VPN atau ganti region API.";
                    }
                    return `Pesan Sistem: ${msg}`;
                }

                if (data.candidates && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                }

                return "MindSmeck mengerti, tapi saya bingung meresponnya. Bisa tanya dengan cara lain?";
            } catch (error) {
                console.error("Critical Network Error:", error);
                return "Gagal terhubung ke server MindSmeck. Pastikan internet Anda stabil.";
            }
        };

        const handleChat = async () => {
            const text = chatInput.value.trim();
            if (!text) return;

            const uMsg = document.createElement('div');
            uMsg.className = 'user-msg';
            uMsg.textContent = text;
            chatHistory.appendChild(uMsg);
            chatInput.value = '';
            chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });

            const bMsg = document.createElement('div');
            bMsg.className = 'bot-msg';
            bMsg.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> MindSmeck sedang berpikir...';
            chatHistory.appendChild(bMsg);
            chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });

            const aiRes = await callGeminiAI(text);
            bMsg.textContent = aiRes;
            chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        };

        btnNext.addEventListener('click', showStep);
        btnSkip.addEventListener('click', switchToChat);
        btnSend.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChat(); });
        closeBot.addEventListener('click', () => { bubble.classList.remove('active'); });
        avatar.addEventListener('click', () => {
            bubble.classList.add('active');
            if (chatInterface.style.display === 'block') {
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }
        });

        setTimeout(() => bubble.classList.add('active'), 2000);
    };

    initBot();

    // Page Loader / Running Student Transition
    const pageLoader = document.getElementById('pageLoader');
    const hideLoader = () => {
        if (pageLoader) {
            pageLoader.classList.add('hidden');
        }
    };

    window.addEventListener('load', () => {
        setTimeout(hideLoader, 800);
    });

    // Fail-safe: hide loader after 3s even if images aren't loaded
    setTimeout(hideLoader, 3000);

    // Smooth Navigation Transitions
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html') && !href.startsWith('#')) {
                e.preventDefault();
                if (pageLoader) {
                    pageLoader.classList.remove('hidden');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 800);
                } else {
                    window.location.href = href;
                }
            }
        });
    });

    console.log('SMK Negeri 9 Manado Website Initialized Successfully.');
});
