/** @format */

import { ConfigLoader } from './config';
import { DiscordBuilder } from './discord';
import { ReadyListener } from './listeners/ready';
import { WebServerBuilder } from './webserver/webserver';
import { GuildInfoHandler } from './webserver/handlers/guildinfo';
import { CORSHandler } from './webserver/handlers/cors';
import { HeadersHandler } from './webserver/handlers/headers';
import logger from './logger';

var cfgLoc = process.argv.length > 2 ? process.argv[2] : 'config.json';

logger.info(`Loading config from ${cfgLoc}...`);
var config = ConfigLoader.openSync(cfgLoc).unwrap(() => {
  logger.error(
    `Config file does not exist. An empty config was created at '${cfgLoc}'. Enter your values and restart.`
  );
  process.exit();
});

logger.info(`Setting up web server...`);
var wsBuilder = new WebServerBuilder()
  .onPort(config.webserver.port)
  .useCertFrom(config.webserver.tlscert)
  .useKeyFrom(config.webserver.tlskey)
  .enableTLS(config.webserver.enabletls)
  .use(new HeadersHandler());

if (config.webserver.enablecors) {
  wsBuilder.use(new CORSHandler(config.webserver.corsallowedorigins));
}

logger.info(`Setting up discord session...`);
new DiscordBuilder()
  .withToken(config.discord.token)
  .use(
    new ReadyListener(() => {
      wsBuilder
        .listenAndServe()
        .then((server) => {
          logger.info(`Web server listening on port ${config.webserver.port}`);
        })
        .catch((err) => {
          logger.error(`Failed starting web server: ${err}`);
          process.exit();
        });
    })
  )
  .start()
  .then((client) => {
    wsBuilder.use(new GuildInfoHandler(client));
  })
  .catch((err) => {
    logger.error(`Failed logging in to discord: ${err}`);
    process.exit();
  });
