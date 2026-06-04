FROM node:18-alpine
WORKDIR /app
COPY services/notification-service/package.json ./package.json
RUN npm install --production || true
COPY services/notification-service /app
CMD ["node", "src/run.js"]
