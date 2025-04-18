# Stage 1: билд фронтенда
FROM node:20-alpine AS build

# Переходим сразу в папку с фронтом
WORKDIR /app/Frontend

# Копируем package.json и ставим зависимости
COPY Frontend/package*.json ./
RUN npm ci

# Копируем .env.frontend в /app/Frontend/.env до копирования остального кода
# чтобы Vite подхватил переменные
COPY .env.frontend .env

# Теперь копируем весь исходник
COPY Frontend .

# Собираем
RUN npm run build

# Stage 2: nginx отдаёт готовую статику
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/Frontend/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
