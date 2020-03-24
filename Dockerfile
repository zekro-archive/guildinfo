FROM node:stretch-slim
LABEL maintainer="zekro <contact@zekro.de>"

WORKDIR /app
EXPOSE 80

COPY src/ src/
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm ci
RUN mkdir -p /etc/guildinfo

ENTRYPOINT ["npm", "start"]
CMD ["/etc/guildinfo/config.json"]