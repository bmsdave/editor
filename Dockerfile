FROM node:alpine

WORKDIR /app
COPY . .

RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium
RUN npm install --production

CMD ["node", "server.js"]