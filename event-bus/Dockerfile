FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production || true
COPY . /app
CMD ["node", "src/run.js"]
