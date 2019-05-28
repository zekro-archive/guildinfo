/** @format */

import { Response } from 'express';

const STATUS: { [unit: number]: string } = {
  400: 'bad request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not found',
  429: 'too many requests',
  500: 'internal server error',
};

export class Error {
  public status: number;
  public message: string;
  public data?: any;

  constructor(status: number, message?: string, data?: any) {
    this.status = status;
    this.message = message ? message : STATUS[status];
    this.data = data;
  }

  public send(res: Response): void {
    res.status(this.status).send(this);
  }
}

export default {
  respondError(res: Response, status: number, message?: string, data?: any) {
    new Error(status, message, data).send(res);
  },
};
