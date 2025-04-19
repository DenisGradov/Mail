# ---------- STAGE 1: build React + Vite ----------
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Копируем .env.frontend (он рядом с docker-compose.yml)
COPY .env.frontend .env

# 2) Устанавливаем зависимости из package.json фронта
COPY Frontend/package*.json ./
RUN npm ci

# 3) Копируем весь исходник фронта
COPY Frontend ./

# 4) Билдим — Vite прочитает VITE_* из .env
RUN npm run build

# ---------- STAGE 2: Nginx отдаёт статику ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/nginx.conf



# копируем собранные артефакты
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
