FROM mhart/alpine-node:8

WORKDIR /app
COPY . .

RUN npm install --production

CMD ["node", "server.js"]