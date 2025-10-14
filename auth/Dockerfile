# Sử dụng image Node.js 18 làm nền
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng mà ứng dụng sử dụng
EXPOSE 3000

# Lệnh để khởi chạy ứng dụng
CMD ["node", "index.js"]