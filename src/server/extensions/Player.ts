import * as alt from 'alt-server';
import * as DRP from '../Main';

alt.Player.prototype.ban = () => {
    DRP.banManager.ban(this);
    DRP.banManager.save();
};

alt.Player.prototype.isBanned = () => {
    return DRP.banManager.isBanned(this);
};