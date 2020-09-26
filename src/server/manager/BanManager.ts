import * as alt from 'alt-server';
import * as DRP from '../Main';
import * as fs from 'fs';
import * as path from 'path';

export class BanManager {
  users: Array<string> = [];

  constructor() {
    let banFilePath = path.join(DRP.configDir, 'bans.json');
    let banJsonData = JSON.parse(fs.readFileSync(banFilePath, 'utf-8'));
    for (let banJsonId in banJsonData) {
      this.users.push(banJsonData[banJsonId]);
    }
  }

  public ban(player: alt.Player) {
    this.users.push(player.hwidHash);
    player.kick('You have been banned from this server!');
  }

  public unBan(playerId: string) {
    this.users = this.users.filter((id) => id !== playerId);
  }

  public save() {
    let banFilePath = path.join(DRP.configDir, 'bans.json');
    fs.writeFileSync(banFilePath, JSON.stringify(this.users));
  }

  public isBanned(player: alt.Player): boolean {
    return this.users.some((banId) => banId === player.hwidHash);
  }
}
