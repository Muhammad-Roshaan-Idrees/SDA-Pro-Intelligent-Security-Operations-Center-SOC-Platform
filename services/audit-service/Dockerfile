<<<<<<< Updated upstream
=======
FROM node:18-alpine
WORKDIR /app
COPY services/audit-service/package.json ./package.json
RUN npm install --production || true
COPY services/audit-service /app
CMD ["node", "src/run.js"]
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3007
CMD ["node", "src/services/AuditService.js"]
>>>>>>> Stashed changes
