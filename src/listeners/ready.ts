/** @format */

import { IEventListener } from '../discord';

export class ReadyListener implements IEventListener {
  constructor() {}

  public get event(): string {
    return 'ready';
  }

  listener(...args: any): void {
    console.log(args);
  }
}
