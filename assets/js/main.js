/**
 * CORE COMPONENT LOADER & INTERACTION ENGINE
 */

$(document).ready(function() {
    // 1. Check Protocol for CORS issues
    if (window.location.protocol === 'file:') {
        $('body').prepend(`
            <div class="alert alert-warning text-center mb-0" style="z-index: 9999; position: relative;">
                <strong>Cảnh báo:</strong> Trình duyệt đang chạy ở chế độ file cục bộ. 
                Vui lòng sử dụng Live Server hoặc Local Web Server để nạp Header/Footer động.
            </div>
        `);
    }

    // 2. Load Components Dynamically
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

    // 3. Navigation Highlighting Logic
    function initNavigationHighlight() {
        const path = window.location.pathname.split("/").pop() || 'index.html';
        $(`nav a[href*="${path}"]`).addClass('active');
    }

    // 4. Intersection Observer for Reveal Animations
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

    // 5. Counter Animation
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

    // 6. Delegated Event Listeners (Handling dynamic content)
    $(document).on('click', '.btn-interactive', function() {
        console.log('Button clicked:', $(this).text());
    });
});
