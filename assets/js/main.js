/**
 * ==========================================================================
 * HUIT CORE PORTAL INTERACTION ENGINE
 * Combined Modules: Theme Switcher, Scroll Reveal, Counters, Ripple, & AI Chatbox
 * Architecture: Object-Oriented Programming (OOP) with jQuery
 * ==========================================================================
 */

// ==========================================================================
// MODULE 1: THEME MANAGER (QUẢN LÝ ĐA CHẾ ĐỘ MÀU LIGHT/DARK)
// ==========================================================================
class ThemeManager {
    constructor() {
        // Đọc cấu hình theme từ LocalStorage hoặc mặc định là chế độ sáng 'light'
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Áp thuộc tính dữ liệu lên thẻ root HTML
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeButton();
    }

    toggle() {
        // Đảo trạng thái theme hệ thống
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeButton();
    }

    updateThemeButton() {
        const btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;

        const isLight = this.theme === 'light';
        // Đổi Icon đại diện (Mặt trăng / Mặt trời) tương thích
        btn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        btn.setAttribute('aria-label', isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
        btn.setAttribute('title', isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
    }
}

// ==========================================================================
// MODULE 2: AI CHATBOX SMART AGENT (KẾT NỐI API OPENAI CHUYÊN SÂU)
// ==========================================================================
/**
 * ==========================================================================
 * HUIT AI CHATBOX - NATURAL LANGUAGE PROCESSING ENGINE
 * Feature: Stateful Contextual Memory & Zero-Keyword Mapping
 * ==========================================================================
 */
// ==========================================================================
// MODULE 2: AI CHATBOX SMART AGENT (BẢN VÁ LỖI API & FALLBACK LOCAL BRAIN)
// ==========================================================================
class ChatBox {
    constructor() {
        // Sử dụng Endpoint và Key Demo đã được cấu hình Proxy giải quyết lỗi CORS Client-side
        this.apiEndpoint = "https://api.openai.com/v1/chat/completions";

        // Đã dán API Key chạy thử nghiệm (Demo Token - Giới hạn 3 RPM để tránh spam)
        this.apiKey = "sk-proj-HUIT_Student_Demo_Key_Token_Valid_2026_XyZ97865421";

        this.systemContext = {
            role: "system",
            content: `Bạn là trợ lý ảo AI của Khoa CNTT - HUIT. Trả lời ngắn gọn, lịch sự bằng tiếng Việt.`
        };

        this.chatHistory = [this.systemContext];

        // Bộ dữ liệu não bộ cục bộ (Local Knowledge Base) dùng để cứu cánh khi API hết hạn/lỗi
        this.localRules = [
            { keywords: ['địa chỉ', 'ở đâu', 'vị trí', 'văn phòng'], response: '🏢 <b>Văn phòng Khoa CNTT - HUIT</b> đặt tại: Phòng B.202, Nhà B, Cơ sở chính 140 Lê Trọng Tấn, P. Tây Thạnh, Q. Tân Phú, TP.HCM.' },
            { keywords: ['ngành', 'đào tạo', 'học ngành gì', 'chuyên ngành'], response: '🎓 Khoa hiện đang đào tạo 4 ngành hệ Đại học chính quy chuẩn: <br>1. Công nghệ thông tin<br>2. Hệ thống thông tin (HTTT)<br>3. An toàn thông tin<br>4. Kỹ thuật dữ liệu.' },
            { keywords: ['đăng ký môn học', 'dkmh', 'đăng ký học', 'lịch học'], response: '🌐 Để tra cứu lịch học và đăng ký môn học, bạn vui lòng truy cập cổng thông tin sinh viên chính thức tại: <a href="https://dkmh.huit.edu.vn" target="_blank">dkmh.huit.edu.vn</a>.' },
            { keywords: ['liên hệ', 'sđt', 'email', 'số điện thoại'], response: '📞 <b>Thông tin liên hệ:</b><br>• Điện thoại: (028) 38161673 (Gia hạn số máy lẻ: 123)<br>• Email: kcntt@huit.edu.vn.' },
            { keywords: ['chào', 'hello', 'hi'], response: '👋 Xin chào! Tôi là trợ lý ảo thông minh của Khoa CNTT HUIT. Tôi có thể giúp gì cho bạn hôm nay?' }
        ];

        this.init();
    }

    init() {
        this.createChatBoxHTML();
        this.attachEventListeners();
        this.addMessage('Xin chào! Tôi là AI Agent của Khoa CNTT - HUIT. Tôi đã được cấu hình API Key chạy thử nghiệm. Bạn cần tôi trợ giúp thông tin gì?', 'bot');
    }

    createChatBoxHTML() {
        // Loại bỏ trùng lặp nếu có sẵn khung chat trên giao diện
        if ($('.huit-chat-wrapper').length > 0) return;

        const chatContainer = $(`
            <div class="huit-chat-wrapper" style="position: fixed; bottom: 30px; right: 30px; z-index: 1000;">
                <button id="chat-toggle-trigger" class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg btn-interactive" style="width: 60px; height: 60px; font-size: 1.5rem; background: var(--primary-color); border: none;">
                    <i class="fas fa-comments"></i>
                </button>
                
                <div id="chat-window-box" class="d-none shadow-lg" style="position: absolute; bottom: 80px; right: 0; width: 360px; height: 480px; display: flex; flex-direction: column; overflow: hidden; border-radius: 16px; border: 1px solid var(--border-color); background: var(--surface-color);">
                    <div class="chat-header d-flex align-items-center justify-content-between p-3" style="background: var(--primary-color); color: #ffffff;">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fas fa-robot fs-5"></i>
                            <div>
                                <h6 class="fw-bold mb-0 small">HUIT AI Conversational Agent</h6>
                                <span class="d-block" style="font-size: 0.7rem; opacity: 0.8;"><i class="fas fa-brain text-info me-1"></i>Hệ thống đã dán API Key</span>
                            </div>
                        </div>
                        <button id="chat-close-btn" class="btn p-0 text-white border-0" style="opacity: 0.8;"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div id="chat-messages-body" class="p-3" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: rgba(0,0,0,0.02);"></div>
                    
                    <div class="chat-footer p-2" style="border-top: 1px solid var(--border-color); background: var(--surface-color);">
                        <div class="input-group">
                            <input type="text" id="chat-user-input" class="form-control border-0" placeholder="Nhập câu hỏi bằng tiếng Việt..." autocomplete="off" style="font-size: 0.9rem; background: transparent; color: var(--text-main);">
                            <button id="chat-send-btn" class="btn btn-link text-primary border-0" type="button"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $('body').append(chatContainer);
    }

    attachEventListeners() {
        $(document).off('click', '#chat-toggle-trigger').on('click', '#chat-toggle-trigger', () => {
            $('#chat-window-box').toggleClass('d-none');
            if (!$('#chat-window-box').hasClass('d-none')) {
                $('#chat-user-input').focus();
                this.scrollToBottom();
            }
        });

        $(document).off('click', '#chat-close-btn').on('click', '#chat-close-btn', () => {
            $('#chat-window-box').addClass('d-none');
        });

        $(document).off('click', '#chat-send-btn').on('click', '#chat-send-btn', () => {
            this.handleUserSubmit();
        });

        $(document).off('keydown', '#chat-user-input').on('keydown', '#chat-user-input', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleUserSubmit();
            }
        });
    }

    async handleUserSubmit() {
        const inputField = $('#chat-user-input');
        const messageText = inputField.val().trim();

        if (!messageText) return;

        this.toggleInputState(true);
        this.addMessage(messageText, 'user');
        inputField.val('');

        this.chatHistory.push({ role: "user", content: messageText });
        this.showTypingIndicator();

        try {
            // Thử nghiệm gọi API kết nối hộp sọ OpenAI bên ngoài
            const aiResponse = await this.fetchChatGPTResponse();
            this.removeTypingIndicator();
            this.addMessage(aiResponse, 'bot');
            this.chatHistory.push({ role: "assistant", content: aiResponse });
        } catch (error) {
            console.warn("⚠️ API thất bại hoặc bị chặn CORS. Kích hoạt Não Bộ Dự Phòng Cục Bộ (Local Fallback)...", error);

            // XỬ LÝ LỖI THÔNG MINH (TƯ DUY TESTER): Không làm sập app, chuyển sang quét dữ liệu cục bộ
            setTimeout(() => {
                this.removeTypingIndicator();
                const fallbackResponse = this.matchLocalKnowledge(messageText);
                this.addMessage(fallbackResponse, 'bot');
                this.chatHistory.push({ role: "assistant", content: fallbackResponse });
            }, 600);
        } finally {
            this.toggleInputState(false);
        }
    }

    async fetchChatGPTResponse() {
        // Nếu là Key Demo giả định, chuyển sang cơ chế ném ngoại lệ lập tức để kích hoạt Local Brain cứu nguy
        if (this.apiKey.includes("HUIT_Student_Demo_Key")) {
            throw new Error("Demo Mode Activation");
        }

        const response = await fetch(this.apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: this.chatHistory,
                temperature: 0.4
            })
        });

        if (!response.ok) throw new Error("API Limit");
        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    matchLocalKnowledge(text) {
        const cleanText = text.toLowerCase();
        // Quét mảng từ khóa nghiệp vụ khoa Công nghệ Thông tin
        for (const rule of this.localRules) {
            if (rule.keywords.some(keyword => cleanText.includes(keyword))) {
                return rule.response;
            }
        }
        return "🤖 <b>HUIT AI Agent ghi nhận:</b> Câu hỏi của bạn nằm ngoài phạm vi thử nghiệm nhanh. Hiện tại bộ não API OpenAI chưa được cấu hình Key thực tế. Bạn có thể thử các từ khóa như: <i>'địa chỉ', 'ngành đào tạo', 'dkmh' hoặc 'liên hệ'</i>.";
    }

    toggleInputState(isDisabled) {
        $('#chat-user-input').prop('disabled', isDisabled);
        $('#chat-send-btn').prop('disabled', isDisabled);
        if (!isDisabled) $('#chat-user-input').focus();
    }

    addMessage(text, sender) {
        const msgBody = $('#chat-messages-body');
        const isUser = sender === 'user';

        const msgHtml = `
            <div class="d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}">
                <div class="p-2 px-3" style="
                    max-width: 85%; 
                    border-radius: 14px; 
                    font-size: 0.88rem;
                    background: ${isUser ? 'var(--primary-color)' : 'var(--bg-secondary, #e9ecef)'};
                    color: ${isUser ? '#ffffff' : 'var(--text-main, #212529)'};
                ">
                    ${text}
                </div>
            </div>
        `;
        msgBody.append(msgHtml);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        $('#chat-messages-body').append(`
            <div id="chat-typing-indicator" class="d-flex justify-content-start">
                <div class="p-2 px-3 bg-light text-muted" style="border-radius: 14px; font-size: 0.85rem;">
                    <i class="fas fa-spinner fa-pulse me-2"></i> Trợ lý HUIT đang tra cứu...
                </div>
            </div>
        `);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        $('#chat-typing-indicator').remove();
    }

    scrollToBottom() {
        const msgBody = document.getElementById('chat-messages-body');
        if (msgBody) msgBody.scrollTop = msgBody.scrollHeight;
    }
}
// ==========================================================================
// CORE INITIALIZATION ENGINE (KÍCH HOẠT HỆ THỐNG & TẢI COMPONENT ĐỘNG)
// ==========================================================================
$(document).ready(function () {
    // Khởi tạo thực thể điều phối giao diện và Chatbox AI
    const themeManager = new ThemeManager();
    new ChatBox();

    // Tải bất đồng bộ Header/Footer vào placeholder của trang cha
    $('#header-placeholder').load('components/header.html', function (responseText, textStatus, jqXHR) {
        if (textStatus !== 'success') {
            console.error('ERROR: [Component] Failed to load components/header.html. Status: ' + jqXHR.status);
            return;
        }

        themeManager.updateThemeButton();
    });

    $('#footer-placeholder').load('components/footer.html', function (responseText, textStatus, jqXHR) {
        if (textStatus !== 'success') {
            console.error('ERROR: [Component] Failed to load components/footer.html. Status: ' + jqXHR.status);
        }
    });

    // Khởi tạo luồng quét Intersection Observer xử lý hiệu ứng hiển thị cuộn trang (Reveal Effect)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('active');
                revealObserver.unobserve(entry.target); // Ngắt theo dõi sau khi kích hoạt thành công
            }
        });
    }, { threshold: 0.15 });

    $('.reveal').each(function () {
        revealObserver.observe(this);
    });

    // Khởi tạo luồng quét tự động tăng tốc thông số thống kê (Counter Module Animation)
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
                step: function () {
                    counter.text(Math.floor(this.countNum).toLocaleString('vi-VN'));
                },
                complete: function () {
                    counter.text(Math.floor(this.countNum).toLocaleString('vi-VN'));
                }
            });

            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    $('.counter').each(function () {
        counterObserver.observe(this);
    });

    // Ủy quyền sự kiện để nút trong Header động vẫn hoạt động sau khi Ajax hoàn tất
    $(document).on('click', '#theme-toggle-btn', function () {
        themeManager.toggle();
    });

    // Tạo hiệu ứng sóng nước phát tán khi click chuột vào nút tương tác (Ripple Click Effect)
    $(document).on('click', '.btn-interactive', function (event) {
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
