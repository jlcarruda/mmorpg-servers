FROM node:14

WORKDIR /usr/src/rest-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN pwd

RUN ls -la

CMD ["node", "server.js"]
