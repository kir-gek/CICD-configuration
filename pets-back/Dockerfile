FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 5000

CMD ["./docker-entrypoint.sh"]