import * as alt from 'alt-client';
import * as game from 'natives';

let view: alt.WebView;

alt.onServer('auth:Open', showAuthPanel);
alt.onServer('auth:Exit', exitAuthPanel);
alt.onServer('auth:Error', errorAuthPanel);
alt.on('auth:Open', showAuthPanel);
alt.on('auth:Exit', exitAuthPanel);

function showAuthPanel() {
  if (view && view.destroy) view.destroy();

  view = new alt.WebView('http://resource/html/auth/index.html');
  view.on('auth:Try', tryAuthPanel);
  view.on('auth:Ready', readyAuthPanel);
  view.focus();

  showCursor(true);
  game.freezeEntityPosition(alt.Player.local.scriptID, true);
  alt.toggleGameControls(false);
}

function exitAuthPanel() {
  if (view && view.destroy) view.destroy();

  showCursor(false);
  game.freezeEntityPosition(alt.Player.local.scriptID, false);
  alt.toggleGameControls(true);
}

function errorAuthPanel(message) {
  if (!view) return;

  view.emit('auth:Error', message);
}

function readyAuthPanel() {
  if (!view) return;

  view.emit('auth:Ready');
}

function tryAuthPanel(username, password, email = null) {
  alt.emitServer('auth:Try', username, password, email);
}

function showCursor(state) {
  try {
    alt.showCursor(state);
  } catch (err) {}
}
