<<<<<<< Updated upstream
=======
FROM node:18-alpine
WORKDIR /app
COPY services/notification-service/package.json ./package.json
RUN npm install --production || true
COPY services/notification-service /app
CMD ["node", "src/run.js"]
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3006
CMD ["node", "src/services/NotificationService.js"]
>>>>>>> Stashed changes
