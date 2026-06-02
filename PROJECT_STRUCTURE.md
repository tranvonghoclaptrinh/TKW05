# Cấu trúc Thư mục Dự án HUIT Portal

Dưới đây là sơ đồ phân cấp thư mục của dự án theo tiêu chuẩn kiến trúc doanh nghiệp đã được thiết lập:

```text
huit-portal/
├── index.html                  # Trang chủ (Bento Grid, Banner, Counter)
├── gioitieu.html               # Trang Giới thiệu (Timeline, Leadership)
├── giangvien.html              # Trang Đội ngũ Giảng viên (Filters, Search)
├── daotao.html                 # Trang Hệ đào tạo (Tabs, Accordion)
├── tintuc.html                 # Trang Tin tức & Sự kiện (Pagination)
├── lienhe.html                 # Trang Liên hệ (Validation, Toast)
│
├── components/                 # Các mảnh Layout nạp động (Dynamic Injection)
│   ├── header.html             # Navbar & Logo
│   ├── footer.html             # Thông tin hành chính & Bản đồ
│   └── sidebar.html            # Thanh lọc dữ liệu (Sử dụng cho trang Giảng viên)
│
├── assets/                     # Tài nguyên tĩnh
│   ├── css/
│   │   └── style.css           # Master Style (Glassmorphism, Variables, Bento)
│   ├── js/
│   │   └── main.js             # Core Engine (AJAX Loader, Animations)
│   └── images/                 # Hình ảnh, Icons, Banner Assets
│
└── PROJECT_STRUCTURE.md        # Tài liệu cấu trúc dự án (File này)
```

## Giải thích các thành phần chính:

| Thư mục/File | Chức năng | Công nghệ sử dụng |
| :--- | :--- | :--- |
| `/components` | Chứa các đoạn mã HTML độc lập để tái sử dụng trên nhiều trang. | AJAX `.load()` |
| `assets/css/style.css` | Quản lý toàn bộ giao diện, biến màu sắc và hiệu ứng Glassmorphism. | CSS3 Variables, Grid |
| `assets/js/main.js` | Điều khiển việc nạp trang, hiệu ứng cuộn và các tương tác chung. | jQuery, Intersection Observer |
| `index.html` | Điểm đầu vào của ứng dụng, trình bày thông tin tổng quan. | Bento Grid Layout |
