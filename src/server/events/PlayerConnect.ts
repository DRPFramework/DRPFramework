import * as alt from 'alt-server';
import * as DRP from '../Main';

alt.on('playerConnect', (player: alt.Player) => {
  if (player.isBanned()) {
    player.kick('Sunucudan uzaklaştırıldığın için giriş yapamazsın!');
    return;
  }
  player.dimension = Math.floor(Math.random() * 50000);
  player.spawn(2827.42333984375, -729.071044921875, 1.9250786304473877, 1);
  player.setSyncedMeta('loggedIn', false);
  alt.emitClient(player, 'auth:Open');
});

alt.on('auth:Done', (player: alt.Player, id: string, username: string, email: string) => {
  alt.emitClient(player, 'auth:Exit');
  player.model = 'mp_m_freemode_01';
  player.dimension = 1;
  player.spawn(-725.7460327148438, -282.2967224121094, 36.959503173828125, 1);
  player.setSyncedMeta('loggedIn', true);
});
