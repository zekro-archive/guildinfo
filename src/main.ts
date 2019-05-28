/** @format */

import { ConfigLoader } from './config';
import { DiscordBuilder } from './discord';
import { ReadyListener } from './listeners/ready';
import { WebServerBuilder } from './webserver/webserver';
import { GuildInfoHandler } from './webserver/handlers/guildinfo';
import { CORSHandler } from './webserver/handlers/cors';
import { HeadersHandler } from './webserver/handlers/headers';
import Logger from './logger';

var cfgLoc = process.argv.length > 2 ? process.argv[2] : 'config.json';

Logger.info(`Loading config from ${cfgLoc}...`);
var config = ConfigLoader.openSync(cfgLoc).unwrap(() => {
  Logger.error(
    `Config file does not exist. An empty config was created at '${cfgLoc}'. Enter your values and restart.`
  );
  process.exit();
});

Logger.info(`Setting up web server...`);
var wsBuilder = new WebServerBuilder()
  .onPort(config.webserver.port)
  .useCertFrom(config.webserver.tlscert)
  .useKeyFrom(config.webserver.tlskey)
  .enableTLS(config.webserver.enabletls)
  .use(new HeadersHandler());

if (config.webserver.enablecors) {
  wsBuilder.use(new CORSHandler(config.webserver.corsallowedorigins));
}

Logger.info(`Setting up discord session...`);
new DiscordBuilder()
  .withToken(config.discord.token)
  .withOwner(config.discord.ownerid)
  .use(
    new ReadyListener(() => {
      wsBuilder
        .listenAndServe()
        .then((server) => {
          Logger.info(`Web server listening on port ${config.webserver.port}`);
        })
        .catch((err) => {
          Logger.error(`Failed starting web server: ${err}`);
          process.exit();
        });
    })
  )
  .start()
  .then((client) => {
    wsBuilder.use(new GuildInfoHandler(client));
  })
  .catch((err) => {
    Logger.error(`Failed logging in to discord: ${err}`);
    process.exit();
  });
