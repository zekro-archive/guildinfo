/** @format */

import { Client } from 'discord.js';
import express, { Express, Request, Response, IRouterMatcher } from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { Server } from 'net';

export enum METHOD {
  ALL = 'ALL',
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export interface IRequestHandler {
  readonly route: string;
  readonly method: METHOD;
  handler(req: Request, res: Response, next: () => void): void;
}

export class WebServerBuilder {
  private app: Express;
  private port: number = 80;
  private cert: string = '';
  private key: string = '';
  private TLSenabled: boolean = false;

  constructor() {
    this.app = express();
  }

  public onPort(port: number): WebServerBuilder {
    this.port = port;
    return this;
  }

  public useCertFrom(cert: string): WebServerBuilder {
    this.cert = cert;
    return this;
  }

  public useKeyFrom(key: string): WebServerBuilder {
    this.key = key;
    return this;
  }

  public enableTLS(enable: boolean = true): WebServerBuilder {
    if (enable && (this.key === '' || this.cert === ''))
      throw Error('TLS key and cert must be configured');
    this.TLSenabled = enable;
    return this;
  }

  public use(handler: IRequestHandler): WebServerBuilder {
    var reqMethod: any;
    switch (handler.method) {
      case METHOD.ALL:
        reqMethod = this.app.all;
        break;
      case METHOD.DELETE:
        reqMethod = this.app.delete;
        break;
      case METHOD.GET:
        reqMethod = this.app.get;
        break;
      case METHOD.POST:
        reqMethod = this.app.post;
        break;
      case METHOD.PUT:
        reqMethod = this.app.put;
        break;
      default:
        throw Error('unallowed method');
    }

    reqMethod
      .bind(this.app, handler.route, handler.handler.bind(handler))
      .call();
    return this;
  }

  public listenAndServe(): Promise<Server> {
    return new Promise((resolve, rejects) => {
      if (this.TLSenabled) {
        resolve(
          https
            .createServer(this.getTLSCRedentials(), this.app)
            .listen(this.port)
        );
      } else {
        resolve(http.createServer(this.app).listen(this.port));
      }
    });
  }

  private getTLSCRedentials(): any {
    var cert = fs.readFileSync(this.cert).toString();
    var key = fs.readFileSync(this.key).toString();
    return { cert, key };
  }
}
