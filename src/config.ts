/** @format */

import { Optional } from './optional';
import fs from 'fs';

export class Config {
  public discord: ConfigDiscord = new ConfigDiscord();
  public webserver: ConfigWebServer = new ConfigWebServer();
}

export class ConfigDiscord {
  public token: string = '';
  public ownerid: string = '';
}

export class ConfigWebServer {
  public port: number = 443;
  public enablecrosssite: boolean = true;
  public enabletls: boolean = true;
  public tlscert: string = '';
  public tlskey: string = '';
}

export class ConfigLoader {
  public static createSync(loc: string, config: Config) {
    let data = JSON.stringify(config, null, 2);
    fs.writeFileSync(loc, data, 'utf8');
  }

  public static openSync(loc: string): Optional<Config> {
    if (!fs.existsSync(loc)) {
      let cfg = new Config();
      ConfigLoader.createSync(loc, cfg);
      return new Optional(null);
    }

    let data = fs.readFileSync(loc, 'utf8');
    return JSON.parse(data);
  }
}
