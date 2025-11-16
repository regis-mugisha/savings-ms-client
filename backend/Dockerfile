FROM node:24.11.1-alpine


WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 7000

CMD [ "npm", "start" ]