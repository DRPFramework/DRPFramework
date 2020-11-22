import * as alt from 'alt-server';
import config from './General';

import { DatabaseManager } from './database/DatabaseManager';
import { BanManager } from './manager/BanManager';
import { GroupManager } from './manager/GroupManager';

import * as path from 'path';

const mainDir = alt.getResourcePath('drp');
const configDir = path.join(mainDir, 'config');

const banManager: BanManager = new BanManager();
const groupManager: GroupManager = new GroupManager();
groupManager.loadGroups();

const databaseManager: DatabaseManager = new DatabaseManager({
  host: config.database.host,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  connectionLimit: 5,
});
databaseManager.open((_connection, error) => {
  if (error) {
    alt.logError(error);
    process.exit(1);
  }
  alt.log('[DRP] Database connection established.');
});

export { mainDir, config, configDir, databaseManager, banManager, groupManager };

import './systems/ChatSystem';

import './extensions/Player';

import './events/PlayerConnect';
