# Sử dụng image Node.js 18 làm nền
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Mở cổng mà ứng dụng sử dụng
EXPOSE 3003

# Lệnh để khởi chạy ứng dụng khi container được tạo
CMD ["node", "index.js"]