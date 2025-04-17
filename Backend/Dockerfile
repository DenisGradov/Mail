FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
ENV NODE_ENV=production
EXPOSE ${BACKEND_PORT:-5050}

CMD ["node","server.js"]
