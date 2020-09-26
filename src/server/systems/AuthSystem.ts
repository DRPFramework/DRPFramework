import * as alt from 'alt-server';
import * as DRP from '../Main';

import { EncryptionUtil } from '../utility/Encryption';

alt.onClient('auth:Try', handleAuthAttempt);
alt.on('auth:Done', debugDoneAuth);

function debugDoneAuth(player: alt.Player, id: string, username: string, email: string) {
  alt.log(`[DRP] ${username}@${id} giriş yaptı!`);
}

async function handleAuthAttempt(player: alt.Player, username: string, password: string, email: string) {
  if (!player || !player.valid) return;

  if (!username || !password) alt.emitClient(player, 'auth:Error', 'Kullanıcı adı ya da Şifre eksik!');

  if (email) {
    handleRegistration(player, username, password, email);
    return;
  }

  handleLogin(player, username, password);
}

async function handleRegistration(player: alt.Player, username: string, password: string, email: string) {
  DRP.databaseManager
    .query('select * from users where `Email` = ? OR `Username` = ?', [email, username])
    .then((data) => {
      if (data[0] != null) {
        alt.emitClient(player, 'auth:Error', 'Kullanıcı adı veya E-Posta zaten kullanımda!');
        return;
      }

      let defaultGroup = DRP.groupManager.getDefaultGroup()[0];
      if (defaultGroup == null) defaultGroup = "default";

      DRP.databaseManager
        .query(
          'INSERT INTO users(`UUID`, `AltName`, `Username`, `Password`, `Email`, `Group`) VALUES(?, ?, ?, ?, ?, ?)',
          [player.hwidHash, player.name, username, EncryptionUtil.encryptPassword(password), email, defaultGroup]
        )
        .then((insertData) => {
          if (insertData.affectedRows == 1) {
            player.setSyncedMeta('Group', defaultGroup);
            alt.emit('auth:Done', player, player.hwidHash, username, email);
          } else {
            alt.emitClient(player, 'auth:Error', 'Kullanıcı kaydı yapılırken bilinmeyen bir hata oluştu!');
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

async function handleLogin(player: alt.Player, username: string, password: string) {
  DRP.databaseManager
    .query('select * from users where `Username` = ?', [username])
    .then((data) => {
      if (data[0] == null) {
        alt.emitClient(player, 'auth:Error', 'Kullanıcı adı veya Şifre hatalı!');
        return;
      }

      if (!EncryptionUtil.verifyPassword(password, data[0].Password)) {
        alt.emitClient(player, 'auth:Error', 'Kullanıcı adı veya Şifre hatalı!');
        return;
      }

      player.setSyncedMeta('Group', data[0].Group);
      alt.emit('auth:Done', player, data[0].UUID, data[0].Username, data[0].Email);
    })
    .catch((err) => console.log(err));
}
