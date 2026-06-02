/**
 * CORE COMPONENT LOADER & INTERACTION ENGINE (V3.0)
 * Features: Theme Switcher, Chat Box, EmailJS Integration
 */

// ============ THEME MANAGEMENT ============
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeButton();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeButton();
    }

    updateThemeButton() {
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.innerHTML = this.theme === 'light' 
                ? '<i class="fas fa-moon"></i>' 
                : '<i class="fas fa-sun"></i>';
        }
    }
}

// ============ CHAT BOX MANAGEMENT ============
class ChatBox {
    constructor() {
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatBoxHTML();
        this.attachEventListeners();
        this.addBotGreeting();
    }

    createChatBoxHTML() {
        const chatHTML = `
            <div class="chat-box-container">
                <button class="chat-box-toggle" id="chat-toggle">
                    <i class="fas fa-comments"></i>
                </button>
                <div class="chat-box-window" id="chat-window">
                    <div class="chat-header">
                        <span>Hỗ trợ Khoa CNTT</span>
                        <button class="chat-close-btn" id="chat-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chat-messages" id="chat-messages"></div>
                    <div class="chat-input-area">
                        <input type="text" id="chat-input" placeholder="Nhập tin nhắn...">
                        <button id="chat-send"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(chatHTML);
    }

    attachEventListeners() {
        $('#chat-toggle').on('click', () => this.toggleChat());
        $('#chat-close').on('click', () => this.toggleChat());
        $('#chat-send').on('click', () => this.sendMessage());
        $('#chat-input').on('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        $('#chat-window').toggleClass('active');
    }

    addBotGreeting() {
        const greeting = "Xin chào! 👋 Tôi là trợ lý ảo của Khoa CNTT. Có gì tôi có thể giúp bạn không?";
        this.addMessage(greeting, 'bot');
    }

    sendMessage() {
        const input = $('#chat-input');
        const message = input.val().trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.val('');

        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "Cảm ơn bạn đã liên hệ! 😊",
                "Bạn có thể xem thêm thông tin tại trang Giới thiệu.",
                "Nếu cần hỗ trợ thêm, vui lòng liên hệ qua email: kcntt@huit.edu.vn",
                "Đội ngũ giảng viên của chúng tôi rất sẵn lòng giúp bạn!",
                "Bạn có muốn tìm hiểu về các chương trình đào tạo không?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage(randomResponse, 'bot');
        }, 500);
    }

    addMessage(text, sender) {
        const messageDiv = $(`<div class="chat-message ${sender}">${text}</div>`);
        $('#chat-messages').append(messageDiv);
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
    }
}

// ============ EMAIL JS INTEGRATION ============
function initEmailJS() {
    // Initialize EmailJS with your public key
    // Note: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('YOUR_PUBLIC_KEY');
}

function sendEmail(formData) {
    const templateParams = {
        to_email: 'kcntt@huit.edu.vn',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            return true;
        }, function(error) {
            console.log('Failed to send email:', error);
            return false;
        });
}

$(document).ready(function() {
    // 1. Initialize Theme Manager
    const themeManager = new ThemeManager();
    
    // 2. Initialize Chat Box
    const chatBox = new ChatBox();

    // 3. Initialize EmailJS
    initEmailJS();

    // 4. Check Protocol for CORS issues
    if (window.location.protocol === 'file:') {
        $('body').prepend(`
            <div class="alert alert-warning text-center mb-0" style="z-index: 9999; position: relative;">
                <strong>Cảnh báo:</strong> Trình duyệt đang chạy ở chế độ file cục bộ. 
                Vui lòng sử dụng Live Server hoặc Local Web Server để nạp Header/Footer động.
            </div>
        `);
    }

    // 5. Load Components Dynamically
    const components = [
        { id: '#header-placeholder', url: 'components/header.html' },
        { id: '#footer-placeholder', url: 'components/footer.html' },
        { id: '#sidebar-placeholder', url: 'components/sidebar.html' }
    ];

    let loadedCount = 0;
    components.forEach(comp => {
        if ($(comp.id).length) {
            $(comp.id).load(comp.url, function() {
                loadedCount++;
                if (loadedCount === components.filter(c => $(c.id).length).length) {
                    initNavigationHighlight();
                }
            });
        }
    });

    // 6. Navigation Highlighting Logic
    function initNavigationHighlight() {
        const path = window.location.pathname.split("/").pop() || 'index.html';
        $(`nav a[href*="${path}"]`).addClass('active');
    }

    // 7. Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('active');
            }
        });
    }, observerOptions);

    $('.reveal').each(function() {
        observer.observe(this);
    });

    // 8. Counter Animation
    $('.counter').each(function() {
        const $this = $(this);
        const countTo = $this.attr('data-count');
        $({ countNum: $this.text() }).animate({
            countNum: countTo
        }, {
            duration: 2000,
            easing: 'swing',
            step: function() {
                $this.text(Math.floor(this.countNum));
            },
            complete: function() {
                $this.text(this.countNum);
            }
        });
    });

    // 9. Theme Toggle Button Event
    $(document).on('click', '#theme-toggle-btn', function() {
        themeManager.toggle();
    });

    // 10. Delegated Event Listeners
    $(document).on('click', '.btn-interactive', function() {
        console.log('Button clicked:', $(this).text());
    });
});
