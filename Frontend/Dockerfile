# Stage 1: build Vite + React
FROM node:20-alpine AS build

WORKDIR /app/Frontend

# 1) зависимости
COPY Frontend/package*.json ./
RUN npm ci

# 2) кладём .env.frontend внутрь фронта (становится .env)
#    => Vite увидит все VITE_* переменные
COPY .env.frontend .env

# 3) копируем исходники
COPY Frontend .

# 4) билд
RUN npm run build

# --------------- Stage 2: Nginx ---------------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/Frontend/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
