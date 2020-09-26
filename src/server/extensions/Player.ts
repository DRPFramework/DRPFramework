import * as alt from 'alt-server';
import * as DRP from '../Main';

alt.Player.prototype.ban = function () {
  DRP.banManager.ban(this);
  DRP.banManager.save();
};

alt.Player.prototype.isBanned = function () {
  return DRP.banManager.isBanned(this);
};

alt.Player.prototype.hasPerm = function (permission: string, controlParent: boolean): boolean {
  return DRP.groupManager.hasPerm(this, permission, controlParent);
};
