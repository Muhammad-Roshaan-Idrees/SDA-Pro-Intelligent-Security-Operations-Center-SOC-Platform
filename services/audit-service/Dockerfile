FROM node:18-alpine
WORKDIR /app
COPY services/audit-service/package.json ./package.json
RUN npm install --production || true
COPY services/audit-service /app
CMD ["node", "src/run.js"]
