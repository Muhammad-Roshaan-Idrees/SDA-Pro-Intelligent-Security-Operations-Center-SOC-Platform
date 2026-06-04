<<<<<<< HEAD
=======
<<<<<<< Updated upstream
=======
FROM node:18-alpine
WORKDIR /app
COPY services/audit-service/package.json ./package.json
RUN npm install --production || true
COPY services/audit-service /app
CMD ["node", "src/run.js"]
>>>>>>> feature/C-dashboard-observer
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3007
<<<<<<< HEAD
CMD ["node", "src/services/AuditService.js"]
=======
CMD ["node", "src/services/AuditService.js"]
>>>>>>> Stashed changes
>>>>>>> feature/C-dashboard-observer
