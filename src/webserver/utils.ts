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
  private _status: number;
  private _message: string;
  private _data?: any;

  constructor(status: number, message?: string, data?: any) {
    this._status = status;
    this._message = message ? message : STATUS[status];
    this._data = data;
  }

  public get status(): number {
    return this._status;
  }

  public get message(): string {
    return this._message;
  }

  public get data(): any | undefined {
    return this._data;
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
