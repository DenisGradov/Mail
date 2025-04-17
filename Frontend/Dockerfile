# билд
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env && npm run build

# прод‑образ
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html   # ← dist гарантированно копируется
