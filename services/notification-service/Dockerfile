<<<<<<< HEAD
=======
<<<<<<< Updated upstream
=======
FROM node:18-alpine
WORKDIR /app
COPY services/notification-service/package.json ./package.json
RUN npm install --production || true
COPY services/notification-service /app
CMD ["node", "src/run.js"]
>>>>>>> feature/C-dashboard-observer
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3006
<<<<<<< HEAD
CMD ["node", "src/services/NotificationService.js"]
=======
CMD ["node", "src/services/NotificationService.js"]
>>>>>>> Stashed changes
>>>>>>> feature/C-dashboard-observer
