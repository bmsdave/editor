FROM node:alpine

WORKDIR /app
COPY . .

ENV CHROME_BIN=/usr/bin/chromium-browser
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium
RUN npm install

CMD ["node", "server.js"]