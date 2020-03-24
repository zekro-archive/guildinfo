FROM node:stretch-slim
LABEL maintainer="zekro <contact@zekro.de>"

WORKDIR /app
EXPOSE 80

COPY src/ src/
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm ci
RUN npx tsc

RUN mkdir -p /etc/guildinfo

ENTRYPOINT ["node", "dist/main.js"]
CMD ["/etc/guildinfo/config.json"]