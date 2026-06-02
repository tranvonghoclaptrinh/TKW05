# Hướng dẫn Cấu hình EmailJS

Dự án TKW05 đã được tích hợp EmailJS để gửi email thực từ form liên hệ. Hãy làm theo các bước dưới đây để cấu hình:

## Bước 1: Tạo tài khoản EmailJS

1. Truy cập [EmailJS](https://www.emailjs.com/) và đăng ký tài khoản miễn phí.
2. Xác minh email của bạn.

## Bước 2: Tạo Email Service

1. Đăng nhập vào EmailJS Dashboard.
2. Vào mục **Email Services** và nhấp **Add New Service**.
3. Chọn nhà cung cấp email (Gmail, Outlook, v.v.).
4. Làm theo hướng dẫn để kết nối email của bạn.
5. Lưu lại **Service ID** (ví dụ: `service_abc123xyz`).

## Bước 3: Tạo Email Template

1. Vào mục **Email Templates** và nhấp **Create New Template**.
2. Tạo template với các biến sau:

```
Subject: {{subject}}

From: {{from_name}} ({{from_email}})
Phone: {{phone}}

Message:
{{message}}
```

3. Lưu lại **Template ID** (ví dụ: `template_abc123xyz`).

## Bước 4: Lấy Public Key

1. Vào **Account** → **API Keys**.
2. Sao chép **Public Key** của bạn.

## Bước 5: Cập nhật File JavaScript

Mở file `assets/js/main.js` và thay thế:

```javascript
emailjs.init('YOUR_PUBLIC_KEY');
```

Bằng:

```javascript
emailjs.init('your_actual_public_key_here');
```

Mở file `lienhe.html` (hoặc bất kỳ file nào sử dụng form) và thay thế:

```javascript
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

Bằng:

```javascript
emailjs.send('your_service_id_here', 'your_template_id_here', templateParams)
```

## Bước 6: Kiểm tra

1. Chạy dự án trên Live Server.
2. Điều hướng đến trang Liên hệ.
3. Điền form và nhấp "Gửi tin nhắn".
4. Kiểm tra email của bạn để xác nhận rằng email đã được gửi thành công.

## Ghi chú

- EmailJS cung cấp 200 email miễn phí mỗi tháng.
- Nếu bạn cần gửi nhiều hơn, hãy nâng cấp gói thanh toán.
- Đảm bảo rằng Public Key không bị lộ công khai trong repository.
