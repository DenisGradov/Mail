# ----------- STAGE 1: build React -----------
FROM node:20-alpine AS builder
WORKDIR /app

# �������� package.json + lock
COPY Frontend/package*.json ./
RUN npm ci

# �������� ���� ��������-��� � ������
COPY Frontend .
ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env && npm run build

# ----------- STAGE 2: nginx � ������ -----------
FROM nginx:1.27-alpine
# ��� ������-������
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# ������� �� �������
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# ���� ����������
EXPOSE 80

CMD ["nginx","-g","daemon off;"]
