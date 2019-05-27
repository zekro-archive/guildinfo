/** @format */

import { Client } from 'discord.js';

export interface IEventListener {
  readonly event: string;
  listener(...args: any): void;
}

export class DiscordBuilder {
  private client: Client;
  private token: string = '';
  private ownerid: string = '';

  constructor() {
    this.client = new Client();
  }

  public withToken(token: string): DiscordBuilder {
    this.token = token;
    return this;
  }

  public withOwner(ownerid: string): DiscordBuilder {
    this.ownerid = ownerid;
    return this;
  }

  public use(listener: IEventListener): DiscordBuilder {
    this.client.addListener(listener.event, listener.listener);
    return this;
  }

  public useOnce(listener: IEventListener): DiscordBuilder {
    this.client.prependOnceListener(listener.event, listener.listener);
    return this;
  }

  public start(): Promise<Client> {
    return new Promise<Client>((resolve, rejects) => {
      this.client
        .login(this.token)
        .then(() => resolve(this.client))
        .catch((err) => rejects(err));
    });
  }
}
