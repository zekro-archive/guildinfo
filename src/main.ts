/** @format */

import { ConfigLoader } from './config';
import { DiscordBuilder } from './discord';
import { ReadyListener } from './listeners/ready';
import Logger from './logger';

var cfgLoc = process.argv.length > 2 ? process.argv[2] : 'config.json';

Logger.info(`Loading config from ${cfgLoc}...`);
var config = ConfigLoader.openSync(cfgLoc).unwrap(() => {
  Logger.crit(
    `Config file does not exist. An empty config was created at '${cfgLoc}'. Enter your values and restart.`
  );
  process.exit();
});

new DiscordBuilder()
  .withToken(config.discord.token)
  .withOwner(config.discord.ownerid)
  .use(new ReadyListener())
  .start();
