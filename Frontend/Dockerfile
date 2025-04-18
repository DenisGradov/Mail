# Stage 1 — билд фронтенда
FROM node:20-alpine AS build

WORKDIR /app

# Копируем manifest
COPY Frontend/package*.json ./
RUN npm ci

# Копируем фронт целиком
COPY Frontend .

# Копируем файл .env.frontend в корень и сразу именем .env (Vite его подхватит)
COPY .env.frontend .env

# Собираем
RUN npm run build

# Stage 2 — Nginx для отдачи статики
FROM nginx:1.27-alpine

# Ваша конфигурация nginx, если нужна
COPY nginx.conf /etc/nginx/nginx.conf

# Очищаем дефолт
RUN rm -rf /usr/share/nginx/html/*

# Копируем артефакты сборки
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
