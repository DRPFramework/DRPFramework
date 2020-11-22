import * as alt from 'alt-server';
import * as DRP from '../Main';
import config from '../General';
import { VectorUtil } from '../utility/Vector';

type CommandHandlerType = {
  [key: string]: {
    description: string;
    callback: (player: alt.Player, args: string[]) => void;
  };
};

let commandHandlers: CommandHandlerType = {};
let ranged = config.chat.range.status;
let chatMinDistance = config.chat.range.distance;
let cancelAllChat = false;

alt.onClient('chat:Message', (player: alt.Player, message: string) => {
  if (message[0] === '/') {
    message = message.trim().slice(1);

    if (message.length > 0) {
      //alt.log('[chat:cmd] ' + player.name + ': /' + msg);

      let args = message.split(' ');
      let cmd = args.shift();

      invokeCommand(player, cmd, args);
    }
  } else {
    if (cancelAllChat) {
      alt.emit('chat:Intercept', player, message);
      return;
    }

    message = message.trim();

    if (message.length <= 0) return;

    //alt.log('[==> CHAT] ' + player.name + ': ' + message);

    if (ranged) {
      var playersInRange = alt.Player.all.filter((x) => VectorUtil.distance(player.pos, x.pos) <= chatMinDistance);

      if (playersInRange.length <= 0) return;

      var closePlayers = playersInRange.filter((x) => VectorUtil.distance(player.pos, x.pos) <= chatMinDistance / 2);
      var farPlayers = playersInRange.filter((x) => VectorUtil.distance(player.pos, x.pos) >= chatMinDistance / 2);

      closePlayers.forEach((target) => {
        alt.emitClient(
          target,
          'chat:Message',
          player.name,
          message.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34')
        );
      });

      farPlayers.forEach((target) => {
        alt.emitClient(
          target,
          'chat:Message',
          null,
          `{707070} ${player.name}: ${message.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34')}`
        );
      });
      return;
    }

    alt.emitClient(
      null,
      'chat:Message',
      player.name,
      message.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34')
    );
  }
});

function invokeCommand(player: alt.Player, command: string, args: string[]) {
  if (commandHandlers[command] == null) {
    return;
  }

  const callback = commandHandlers[command].callback;

  if (callback) callback(player, args);
  else send(player, `{FF0000} Bilinmeyen komut! /${command}`);
}

export function send(player: alt.Player, message: string) {
  alt.emitClient(player, 'chat:Message', null, message);
}

export function broadcast(message: string) {
  send(null, message);
}

// Formatting for in-chat debug messages.
export function success(message: string) {
  broadcast(`{00FF00}[Başarılı] ${message}`);
}

export function info(message: string) {
  broadcast(`{FFAB0F}[Bilgi] ${message}`);
}

export function warning(message: string) {
  broadcast(`{FF8989}[Uyarı] ${message}`);
}

export function error(message: string) {
  broadcast(`{FF0000}[Hata] ${message}`);
}
// Formatting for in-chat debug messages.

export function registerCommand(
  commandNames: string[],
  description: string,
  callback: (player: alt.Player, args: string[]) => void
) {
  for (let i = 0; i < commandNames.length; i++) {
    const commandName = commandNames[i].toLowerCase();
    //if (cmdHandlers[commandName]) continue;

    commandHandlers[commandName] = {
      description,
      callback,
    };
  }
}

alt.on('chat:SendMessage', (player: alt.Player, message: string) => {
  send(player, message);
});

alt.on('chat:BroadcastMessage', (message: string) => {
  send(null, message);
});

export default {
  send,
  broadcast,
  registerCommand,
  success,
  info,
  warning,
  error,
};
