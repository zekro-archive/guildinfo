/** @format */

import { IRequestHandler, METHOD } from '../webserver';
import { Request, Response } from 'express';
import { Client } from 'discord.js';
import Utils from '../utils';

class GuildInfoResponse {
  public name?: string;
  public id?: string;
  public icon_url?: string;
  public owner?: UserData;
  public owner_online?: boolean;
  public members_total?: number;
  public members_online?: number;
  public roles?: GuildInfoRole[];
}

class GuildInfoRole {
  public role?: RoleData;
  public members_total?: number;
  public members_online?: number;
}

class RoleData {
  public id?: string;
  public name?: string;
  public color?: number;
  public position?: number;
}

class UserData {
  public id?: string;
  public user_name?: string;
  public discriminator?: string;
  public avatar_url?: string;
}

export class GuildInfoHandler implements IRequestHandler {
  private client: Client;
  public readonly route: string = '/api/guildinfo/:id(\\d+)';
  public readonly method: METHOD = METHOD.GET;

  constructor(client: Client) {
    this.client = client;
  }

  public handler(req: Request, res: Response, next: () => void): void {
    let guildID = req.params['id'];
    let guild = this.client.guilds.get(guildID);
    if (!guild) {
      return Utils.respondError(res, 404, 'guild not found');
    }

    let ginfo = new GuildInfoResponse();
    ginfo.id = guild.id;
    ginfo.name = guild.name;
    ginfo.icon_url = guild.iconURL;
    ginfo.owner = {
      id: guild.owner.user.id,
      user_name: guild.owner.user.username,
      avatar_url: guild.owner.user.avatarURL,
      discriminator: guild.owner.user.discriminator,
    };
    ginfo.owner_online = guild.owner.presence.status !== 'offline';
    ginfo.members_total = guild.memberCount;

    let onlineMembers = guild.members.filter(
      (m) => m.presence.status !== 'offline'
    );

    ginfo.members_online = onlineMembers.size;

    ginfo.roles = [];
    guild.roles.forEach((r) => {
      let rInfo = new GuildInfoRole();
      let roleMembers = guild!.members.filter(
        (m) => m.roles.find((_r) => r.id === _r.id) != undefined
      );

      rInfo.role = new RoleData();
      rInfo.role.id = r.id;
      rInfo.role.name = r.name;
      rInfo.role.color = r.color;
      rInfo.role.position = r.position;
      rInfo.members_total = roleMembers.size;
      rInfo.members_online = roleMembers.filter(
        (m) => m.presence.status !== 'offline'
      ).size;

      ginfo.roles!.push(rInfo);
    });

    res.status(200).send(ginfo);
  }
}
