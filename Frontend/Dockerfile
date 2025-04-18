# ---------- STAGE 1: Vite build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 1) deps
COPY package*.json ./
RUN npm ci

# 2) положим .env.frontend в корень билда (станет .env)
COPY ../.env.frontend .env

# 3) копируем остальной код фронта
COPY . .

# 4) билд — Vite подхватит все VITE_* из .env
RUN npm run build

# ---------- STAGE 2: Nginx ----------
FROM nginx:1.27-alpine

# свой nginx.conf (если есть)
COPY nginx.conf /etc/nginx/nginx.conf

# копируем собранный dist
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
