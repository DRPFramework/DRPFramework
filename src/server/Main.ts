import * as alt from 'alt-server';

import * as fs from 'fs';
import * as path from 'path';

import { DatabaseManager } from './database/DatabaseManager';
import { BanManager } from './manager/BanManager';
import { GroupManager } from './manager/GroupManager';

import './extensions/Player';
import './systems/AuthSystem';

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
  alt.log('Database connection established.');
});

const banManager: BanManager = new BanManager();
const groupManager: GroupManager = new GroupManager();

export { mainDir, configDir, config, databaseManager, banManager, groupManager };
