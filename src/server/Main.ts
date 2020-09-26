import * as alt from 'alt-server';

import * as fs from 'fs';
import * as path from 'path';

import { DatabaseManager } from './database/DatabaseManager';
import { BanManager } from './manager/BanManager';
import { GroupManager } from './manager/GroupManager';

const mainDir = alt.getResourcePath('drp');
const configDir = path.join(mainDir, 'config');

type ConfigType = {
  database: {
    host: string;
    database: string;
    user: string;
    password: string;
  };
};

const config: ConfigType = JSON.parse(fs.readFileSync(path.join(configDir, 'general.json'), 'utf-8'));

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

import './extensions/Player';

import './events/PlayerConnect';

import './systems/AuthSystem';

export { mainDir, configDir, config, databaseManager, banManager, groupManager };
