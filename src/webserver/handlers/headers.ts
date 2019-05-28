/** @format */

import { IRequestHandler, METHOD } from '../webserver';
import { Request, Response } from 'express';

export class HeadersHandler implements IRequestHandler {
  public readonly route: string = '/api/*';
  public readonly method: METHOD = METHOD.ALL;

  constructor() {}

  public handler(req: Request, res: Response, next: () => void): void {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Server', 'guildinfo');
    next();
  }
}
