# 第一阶段：构建阶段
FROM node:20-alpine AS builder

WORKDIR /app
# 先复制依赖文件，利用Docker缓存加速构建
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm install
RUN npm run build

# # 第二阶段：运行阶段
# FROM nginx:alpine
# # 将构建好的静态文件复制到Nginx服务的默认目录
# COPY --from=builder /app/build /usr/share/nginx/html