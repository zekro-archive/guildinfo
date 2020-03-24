/** @format */

import { Client } from 'discord.js';
import { IEventListener } from '../discord';
import logger, { catcher } from '../logger';
import Const from '../const';

export class ReadyListener implements IEventListener {
  private client: Client = new Client();
  private onReady?: () => void;

  constructor(onReady?: () => void) {
    this.onReady = onReady;
  }

  public get event(): string {
    return 'ready';
  }

  setClient(client: Client): void {
    this.client = client;
  }

  listener(...args: any): void {
    let self = this.client.user;
    logger.info(`Logged in as ${self.tag} (${self.id})`);
    logger.info(
      `Invite link: https://discordapp.com/api/oauth2/authorize?client_id=${self.id}&scope=bot&permissions=${Const.PERMISSIONS}`
    );

    this.client.user.setStatus('invisible').catch(catcher);

    if (this.onReady) this.onReady();
  }
}
