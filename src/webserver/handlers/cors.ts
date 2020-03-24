/** @format */

import { IRequestHandler, METHOD } from '../webserver';
import { Request, Response } from 'express';

export class CORSHandler implements IRequestHandler {
  public readonly route: string = '/*';
  public readonly method: METHOD = METHOD.ALL;
  private allowedOrigins: string;

  constructor(allowedOrigins: string) {
    this.allowedOrigins = allowedOrigins;
  }

  public handler(req: Request, res: Response, next: () => void): void {
    res.setHeader('Access-Control-Allow-Origin', this.allowedOrigins);
    res.setHeader(
      'Access-Control-Allow-Methods',
      Object.values(METHOD)
        .filter((m) => m !== METHOD.ALL)
        .join(', ')
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
}
