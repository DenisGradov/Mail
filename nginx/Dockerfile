# ----------- STAGE 1: build React -----------
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем package.json + lock
COPY Frontend/package*.json ./
RUN npm ci

# Копируем весь фронтенд-код и билдим
COPY Frontend .
ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env && npm run build

# ----------- STAGE 2: nginx с прокси -----------
FROM nginx:1.27-alpine
# Ваш прокси-конфиг
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Статика из билдера
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Порт контейнера
EXPOSE 80

CMD ["nginx","-g","daemon off;"]
