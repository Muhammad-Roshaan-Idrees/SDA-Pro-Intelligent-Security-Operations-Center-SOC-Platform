<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
FROM node:18-alpine
WORKDIR /app
COPY services/notification-service/package.json ./package.json
RUN npm install --production || true
COPY services/notification-service /app
CMD ["node", "src/run.js"]
=======
>>>>>>> Stashed changes
FROM node:18-alpine
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# Copy service sources
COPY . .

# Optional: expose a port if the service serves HTTP (demo uses none)
EXPOSE 3006
<<<<<<< Updated upstream
CMD ["node", "src/services/NotificationService.js"]
>>>>>>> Stashed changes
=======

# Run demo runner
CMD ["node", "src/run.js"]
>>>>>>> Stashed changes
