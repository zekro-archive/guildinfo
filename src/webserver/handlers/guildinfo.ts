/** @format */

import { IRequestHandler, METHOD } from '../webserver';
import { Request, Response } from 'express';

export class GuildInfoHandler implements IRequestHandler {
  public readonly route: string = '/api/guildinfo/:id(\\d+)';
  public readonly method: METHOD = METHOD.GET;

  public handler(req: Request, res: Response): void {
    console.log(req);
    res.status(200);
    res.send('OK');
  }
}
