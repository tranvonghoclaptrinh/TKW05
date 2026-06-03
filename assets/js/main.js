/**
 * HUIT portal interaction engine
 * Theme switcher, dynamic components, reveal effects, counters, and chat box
 */

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
        if (!btn) return;

        const isLight = this.theme === 'light';
        btn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        btn.setAttribute('aria-label', isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
        btn.setAttribute('title', isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
    }
}

class ChatBox {
    constructor() {
        this.init();
    }

    init() {
        this.createChatBoxHTML();
        this.attachEventListeners();
        this.addMessage('Xin chào! Tôi là trợ lý ảo của Khoa CNTT. Bạn cần hỗ trợ thông tin gì?', 'bot');
    }

    createChatBoxHTML() {
        const chatHTML = `
            <div class="chat-box-container">
                <button class="chat-box-toggle" id="chat-toggle" aria-label="Mở hộp thoại hỗ trợ">
                    <i class="fas fa-comments"></i>
                </button>
                <div class="chat-box-window" id="chat-window" aria-live="polite">
                    <div class="chat-header">
                        <span>Hỗ trợ Khoa CNTT</span>
                        <button class="chat-close-btn" id="chat-close" aria-label="Đóng hộp thoại">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chat-messages" id="chat-messages"></div>
                    <div class="chat-input-area">
                        <input type="text" id="chat-input" placeholder="Nhập tin nhắn..." aria-label="Nội dung tin nhắn">
                        <button id="chat-send" aria-label="Gửi tin nhắn"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;

        $('body').append(chatHTML);
    }

    attachEventListeners() {
        $('#chat-toggle, #chat-close').on('click', () => this.toggleChat());
        $('#chat-send').on('click', () => this.sendMessage());
        $('#chat-input').on('keypress', (event) => {
            if (event.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        $('#chat-window').toggleClass('active');
        $('#chat-input').trigger('focus');
    }

    sendMessage() {
        const input = $('#chat-input');
        const message = input.val().trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.val('');

        setTimeout(() => {
            const responses = [
                'Bạn có thể xem thông tin tuyển sinh và chương trình học tại trang Đào tạo.',
                'Khoa thường xuyên cập nhật hội thảo, cuộc thi và thông báo tại trang Tin tức.',
                'Nếu cần trao đổi trực tiếp, bạn có thể dùng trang Liên hệ để gửi thông tin.',
                'Đội ngũ giảng viên luôn sẵn sàng hỗ trợ sinh viên trong học tập và nghiên cứu.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage(randomResponse, 'bot');
        }, 450);
    }

    addMessage(text, sender) {
        const messageDiv = $('<div/>', {
            class: `chat-message ${sender}`,
            text
        });

        $('#chat-messages').append(messageDiv);
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
    }
}

function initEmailJS() {
    if (window.emailjs && typeof window.emailjs.init === 'function') {
        window.emailjs.init('YOUR_PUBLIC_KEY');
    }
}

function sendEmail(formData) {
    if (!window.emailjs) return Promise.reject(new Error('EmailJS is not available'));

    const templateParams = {
        to_email: 'kcntt@huit.edu.vn',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
    };

    return window.emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
}

$(document).ready(function() {
    const themeManager = new ThemeManager();
    new ChatBox();
    initEmailJS();

    if (window.location.protocol === 'file:') {
        $('body').prepend(`
            <div class="alert alert-warning text-center mb-0 rounded-0" style="z-index: 9999; position: relative;">
                <strong>Cảnh báo:</strong> Vui lòng dùng Live Server hoặc local web server để nạp header/footer động.
            </div>
        `);
    }

    const components = [
        { id: '#header-placeholder', url: 'components/header.html' },
        { id: '#footer-placeholder', url: 'components/footer.html' },
        { id: '#sidebar-placeholder', url: 'components/sidebar.html' }
    ];

    const existingComponents = components.filter((component) => $(component.id).length);
    let loadedCount = 0;

    existingComponents.forEach((component) => {
        $(component.id).load(component.url, function() {
            loadedCount += 1;
            if (loadedCount === existingComponents.length) {
                initNavigationHighlight();
                themeManager.updateThemeButton();
            }
        });
    });

    function initNavigationHighlight() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        $(`nav a[href$="${path}"]`).addClass('active');
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    $('.reveal').each(function() {
        revealObserver.observe(this);
    });

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = $(entry.target);
            if (counter.data('counted')) return;

            counter.data('counted', true);
            $({ countNum: 0 }).animate({
                countNum: Number(counter.attr('data-count')) || 0
            }, {
                duration: 1800,
                easing: 'swing',
                step: function() {
                    counter.text(Math.floor(this.countNum).toLocaleString('vi-VN'));
                },
                complete: function() {
                    counter.text(Math.floor(this.countNum).toLocaleString('vi-VN'));
                }
            });

            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    $('.counter').each(function() {
        counterObserver.observe(this);
    });

    $(document).on('click', '#theme-toggle-btn', function() {
        themeManager.toggle();
    });

    $(document).on('click', '.btn-interactive', function(event) {
        const button = $(this);
        const offset = button.offset();
        const ripple = $('<span class="ripple"></span>');

        ripple.css({
            left: event.pageX - offset.left,
            top: event.pageY - offset.top
        });

        button.append(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});
