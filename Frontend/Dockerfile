# ——————————————————————————
# 1) билдим React + Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env && npm run build

# ——————————————————————————
# 2) объединяем статику + proxy‑nginx
FROM nginx:1.27-alpine
# берём нашу конфигурацию
COPY nginx.conf /etc/nginx/nginx.conf

# чистим дефолты
RUN rm -rf /usr/share/nginx/html/*

# копируем собранную статику
COPY --from=build /app/Frontend/dist/ /usr/share/nginx/html/


EXPOSE 80
CMD ["nginx","-g","daemon off;"]
