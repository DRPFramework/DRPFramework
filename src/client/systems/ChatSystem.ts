import * as alt from 'alt-client';
import * as game from 'natives';

let buffer = [];

let loaded = false;
let opened = false;
let hidden = false;

let view: alt.WebView = new alt.WebView('http://resource/html/chat/index.html');

alt.onServer('chat:Message', pushMessage);

function addMessage(name: string, text: string) {
  if (name) view.emit('chat:AddMessage', name, text);
  else view.emit('chat:AddString', text);
}

view.on('chat:Loaded', () => {
  for (const message of buffer) {
    addMessage(message.name, message.text);
  }

  loaded = true;
  alt.emitServer('chat:Loaded');
});

view.on('chat:Message', (text: string) => {
  alt.emitServer('chat:Message', text);

  if (text !== undefined && text.length >= 1) alt.emit('chat:MessageSent', text);

  opened = false;
  alt.emit('chat:Closed');
  alt.toggleGameControls(true);
});

export function pushMessage(name: string, text: string) {
  if (!loaded) buffer.push({ name, text });
  else addMessage(name, text);
}

export function pushLine(text) {
  pushMessage(null, text);
}

export function isChatHidden() {
  return hidden;
}

export function isChatOpen() {
  return opened;
}

alt.on('keyup', (key) => {
  if (!loaded) return;

  if (!opened && key === 0x54 && alt.gameControlsEnabled()) {
    opened = true;
    view.emit('chat:Open', false);
    alt.emit('chat:Opened');
    alt.toggleGameControls(false);
  } else if (!opened && key === 0xbf && alt.gameControlsEnabled()) {
    opened = true;
    view.emit('chat:Open', true);
    alt.emit('chat:Opened');
    alt.toggleGameControls(false);
  } else if (opened && key == 0x1b) {
    opened = false;
    view.emit('chat:Close');
    alt.emit('chat:Closed');
    alt.toggleGameControls(true);
  }

  if (key == 0x76) {
    hidden = !hidden;
    game.displayHud(!hidden);
    game.displayRadar(!hidden);
    view.emit('chat:Hide', hidden);
  }
});

export default { pushMessage, pushLine, isChatHidden, isChatOpen };
