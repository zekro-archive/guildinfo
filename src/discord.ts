/** @format */

import { Client } from 'discord.js';

export interface IEventListener {
  readonly event: string;
  listener(...args: any): void;
  setClient(client: Client): void;
}

export class DiscordBuilder {
  private client: Client;
  private token: string = '';
  // private ownerid: string = '';

  constructor() {
    this.client = new Client({
      fetchAllMembers: true,
    });
  }

  public withToken(token: string): DiscordBuilder {
    this.token = token;
    return this;
  }

  public withOwner(ownerid: string): DiscordBuilder {
    // this.ownerid = ownerid;
    return this;
  }

  public use(listener: IEventListener): DiscordBuilder {
    listener.setClient(this.client);
    this.client.addListener(listener.event, listener.listener.bind(listener));
    return this;
  }

  public useOnce(listener: IEventListener): DiscordBuilder {
    listener.setClient(this.client);
    this.client.prependOnceListener(
      listener.event,
      listener.listener.bind(listener)
    );
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
